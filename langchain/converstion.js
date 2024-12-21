import { GoogleGenerativeAI } from "@google/generative-ai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { AIMessage, HumanMessage } from "@langchain/core/messages";
import "dotenv/config";
import readline from "node:readline";
// const question = process.argv[2] || "no question was given";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = "gemini-2.0-flash-exp";
const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "embedding-001",
});
const chatHistory = [
  new HumanMessage("hi , my name is  ferhat , how are you?"),
  new AIMessage("hello , doing great"),
  new HumanMessage("im tired i want to know more about javascript closure "),
  new AIMessage("no problem , i would like to help you "),
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const { response, results } = await query();
console.log("Chatbot initialized. Type 'exit' to end the chat.");
query();

//**********************************************************************************************

//!create vector Store
async function createStore(docs) {
  return await MemoryVectorStore.fromDocuments(docs, geminiEmbeddings);
}

// !START
async function query() {
  const question = await new Promise((resolve) => {
    rl.question("You: ", resolve);
  });
  if (question == "exit") {
    rl.close();
    return;
  }
  const loader = new CheerioWebBaseLoader(
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
  );

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    separator: ". ",
    chunkOverlap: 80,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);

  const vectorStore = await createStore(splitDocs);

  const results = await vectorStore.similaritySearch(question, 1);
  const response = await genAI.getGenerativeModel({ model }).generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `you are ai assistant for javascript and nice person  
            - be friendly and helpful and clear and short  answer dont let the user know you are an ai
            - answer without introdution  
            Question: ${question}
            Chat History:${chatHistory.map((r) => r.content).join("\n")}
          Context : ${results.map((r) => r.pageContent).join("\n")}

            `,
          },
        ],
      },
    ],
  });
  chatHistory.push(new HumanMessage(question));
  chatHistory.push(new AIMessage(response.response.text()));

  // if (question == "no question was given") {
  //   console.log(`Answer: ${response.response.text()}`);
  // } else {
  //   console.log(
  //     `Answer: ${response.response.text()}\n\nSources:\n ${results
  //       .map((r) => r.metadata.source)
  //       .join("\n")}`
  //   );
  // }
  process.stdout.write(
    `     Sources: ${results[0].metadata.source}\n
    AI: ${response.response.text()}
 `
  );
  query();
  // return { response, results };
}
