import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const question = process.argv[2] || "hi";
const video = `https://youtu.be/zR_iuq2evXo?si=cG8rODgRgXOx9_Cn`;

const genAI = new GoogleGenerativeAI(process.env.TOKEN);
const model = "gemini-pro";
const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.TOKEN,
  modelName: "embedding-001", // Use the correct embedding model name
});

const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, geminiEmbeddings);

export const docsFromYTVideo = async (video) => {
  const loader = YoutubeLoader.createFromUrl(video, {
    language: "en",
    addVideoInfo: true,
  });
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: " ",
      chunkSize: 2500,
      chunkOverlap: 100,
    })
  );
};

const loadStore = async () => {
  const videoDocs = await docsFromYTVideo(video);

  return createStore([...videoDocs]);
};

const query = async () => {
  const store = await loadStore();
  const results = await store.similaritySearch(question, 2);

  const response = await genAI.getGenerativeModel({ model }).generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
              Question: ${question}
    
              Context: ${results.map((r) => r.pageContent).join("\n")}`,
          },
        ],
      },
    ],
  });
  console.log(
    `Answer: ${response.response.text()}\n\nSources: ${results
      .map((r) => r.metadata.source)
      .join(", ")}`
  );
};
query();
/*
ducument qa

- document qa: like white paper ai : scientific paper like based on it i will ask question and get answer

- it need to be accurate , efficient and easy to use

document loaders!!
if you want to teach your ai sometyhing 

---
we need to lead and split our data into chunks  so that we dont need to process all the data for one question
 

*/
