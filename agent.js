// tool , model , prompt , create agent , agent executor,chat history
//retrieval is used to retrieve data from vector store after we split it into chunks and store it in vector store
//we can create retrieval tool  from langchain/tools/retrievals
//when we create we pass name , description and than add it to the list of tools
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const chatHistory = [];
// Define the tools the agent will have access to search the internet
const tool = new TavilySearchResults();
const tools = [tool];

//create model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.6,
  verbose: true,
  maxOutputTokens: 2000,
});

//create prompt
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "you are helpful assistant called DocsHood Ai agent helps on javascript and typescript  ,react and next.js only . answer all relevant question about them using stackoverflow ,mdn docs , javascript.info and always send recources at the end  ",
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],

  new MessagesPlaceholder("agent_scratchpad"),
]);

//create agent
const agent = await createToolCallingAgent({
  llm: model,
  tools,
  prompt,
});

//create agent executorfg
const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

// const result = await agentExecutor.invoke({
//   input: "what is typescript?",
// });
//use the readline to call agent

console.log("welcome to the agent , Type 'exit' to end the chat.");
startChat();

async function startChat() {
  rl.question("User :", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    const result = await agentExecutor.invoke({
      input: userInput,
      chat_history: chatHistory,
    });
    process.stdout.write(`\nDocsHood Agent: ${result.output}\n\n`);
    chatHistory.push(new HumanMessage(userInput));
    chatHistory.push(new AIMessage(result.output));
    startChat();
  });
}
