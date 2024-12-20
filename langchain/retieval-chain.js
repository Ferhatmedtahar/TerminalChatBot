/*
DOCUMENT: its an object that contain text and metadata like the source :url, pdf 
createStuffDocumentsChain allow us to pass multiple documents */

//old
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { Document } from "@langchain/core/documents"; no need for it now

//!!!
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import "dotenv/config";

const question = process.argv[2] || "no question was given";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = "gemini-pro";
const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "embedding-001",
});

const createStore = async (docs) =>
  await MemoryVectorStore.fromDocuments(docs, geminiEmbeddings);

const loader = new CheerioWebBaseLoader(
  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/"
);

const docs = await loader.load();
//thats a problem bcs now we are loading the entire page and we are charged for this
// so we need to include only the peices of text that are relevant

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 400,
  separator: ". ",
  chunkOverlap: 80,
});

//array of documents
const docsSplit = await textSplitter.splitDocuments(docs);

// so what we want is to pass only the relevant chunks to the llm
//but to do so we need to use vector store
//vector store : its like a database that allow us to store and search based on the meaning of the data
// `semantic search`
const vectorStore = await createStore(docsSplit);
const query = async () => {
  const results = await vectorStore.similaritySearch(question, 2); // Get more results
  // const results = await vectorStore.asRetriever({
  //   k: 4,
  // });
  const response = await genAI.getGenerativeModel({ model }).generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Use the following context and answer the user's question
            and  show basic code example and one harder example than usage of the thing you are explaining
            than provide some helpful problem solving website that he can test his knowlodge on
            if the user ask about something out of the context of javascript , just say you are designed to help with javascript only!.
            if the question is "no question was given" say ask me a question

            Question: ${question}
    
                 context : ${results.map((r) => r.pageContent).join("\n")}`,
          },
        ],
      },
    ],
  });
  if (question == "no question was given") {
    console.log(`Answer: ${response.response.text()}`);
  } else {
    console.log(
      `Answer: ${response.response.text()}\n\nSources:\n ${results
        .map((r) => r.metadata.source)
        .join("\n")}`
    );
  }
};
query();

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.0-flash-exp",
//   temperature: 0.7,
//   verbose: true,
//   maxOutputTokens: 1000,
// });

// const prompt = ChatPromptTemplate.fromTemplate(`
//   context: {context}
//   answer the user's question :{input}
//   `);

// const chain = prompt.pipe(model);
// const chain = await createStuffDocumentsChain({
//   llm: model,
//   prompt: prompt,
// });

// const res = await chain.invoke({
//   input: "explain me what is the isNaN function in javascript how it works ",
//   context: docsSplit,
// });
