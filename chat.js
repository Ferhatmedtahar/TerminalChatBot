/*
 - Quick note about scaling issues with chat based applications
 - token limit and handle that properly
 - handle prompt injection and other issues
 - handle chat history
 - temperature to get more creative or never lie
 - fine tuning 
 - document QA:RAG retrieval assistant generation
 - handle steaming long responses
*/
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
import readline from "node:readline";
configDotenv();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const token = process.env.TOKEN;
const genAI = new GoogleGenerativeAI(token); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper functions
const newMessage = async (history, message) => {
  const parts = history.map((msg) => msg.content);
  parts.push(message.content);
  const res = await model.generateContent(parts);
  return {
    role: "model",
    content: res.response.text(),
  };
};

const formatMessage = (userInput) => {
  return {
    role: "user",
    content: userInput,
  };
};

// Function to remove markdown formatting
const removeMarkdown = (text) => {
  // Remove bold and italic markers
  let formattedText = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  formattedText = formattedText.replace(/\*([^*]+)\*/g, "$1");

  // Remove inline code backticks
  formattedText = formattedText.replace(/`([^`]+)`/g, "$1");
  formattedText = formattedText.replace(/```[\s\S]*?```/g, (match) =>
    match.replace(/```/g, "")
  );
  return formattedText;
};

const chat = async () => {
  const history = [
    {
      role: "system",
      content: `You are a helpful AI assistant. Answer the user's questions to the best of you ability.`,
    },
  ];

  process.stdout.write("\n\nAI: How can I help you today?\n\n");
  while (true) {
    const userInput = await new Promise((resolve) => {
      rl.question("You: ", resolve);
    });

    if (userInput.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    process.stdout.write("\nAI: Thinking...\n\n");
    const userMessage = formatMessage(userInput);
    const modelResponse = await newMessage(history, userMessage);

    history.push(userMessage);
    history.push(modelResponse);
    const formattedResponse = removeMarkdown(modelResponse.content);
    process.stdout.write(`\rAI: ${formattedResponse}\n\n`);
  }
};

console.log("Chatbot initialized. Type 'exit' to end the chat.");
chat();
