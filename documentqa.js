import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const question = process.argv[2] || "hi";
const video = `https://youtu.be/PkZNo7MFNFg?si=iXBVR3FUfekxqAQA`;

const genAI = new GoogleGenerativeAI(process.env.TOKEN);
const model = "gemini-pro";
const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.TOKEN,
  modelName: "embedding-001",
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
      separator: ". ", // Split by sentences
      chunkSize: 1000, // Reduce chunk size
      chunkOverlap: 200, // Increase overlap
    })
  );
};

const loadStore = async () => {
  const videoDocs = await docsFromYTVideo(video);

  return createStore([...videoDocs]);
};

const query = async () => {
  const store = await loadStore();
  const results = await store.similaritySearch(question, 4); // Get more results

  const response = await genAI.getGenerativeModel({ model }).generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Use the following transcript from a YouTube video to answer the user's question. The transcript is divided into sections, and the sections relevant to the question are below. If you can't answer from this transcript alone, just say you need more context.

                Question: ${question}
    
                Transcript sections: ${results
                  .map((r) => r.pageContent)
                  .join("\n")}`,
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
