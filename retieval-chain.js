/*
DOCUMENT: its an object that contain text and metadata like the source :url, pdf 
createStuffDocumentsChain allow us to pass multiple documents */
import { Document } from "@langchain/core/documents";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

//old
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
  verbose: true,
  maxOutputTokens: 1000,
});

const prompt = ChatPromptTemplate.fromTemplate(`
  context: {context} 
  answer the user's question :{input}
  `);
// const chain = prompt.pipe(model);
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt: prompt,
});
//documents
const documenta = new Document({
  pageContent: `
  A web browser provides an ECMAScript host environment for client-side computation including, for instance, objects that represent windows, menus, pop-ups, dialog boxes, text areas, anchors, frames, history, cookies, and input/output. Further, the host environment provides a means to attach scripting code to events such as change of focus, page and image loading, unloading, error and abort, selection, form submission, and mouse actions. Scripting code appears within the HTML and the displayed page is a combination of user interface elements and fixed and computed text and images. The scripting code is reactive to user interaction, and there is no need for a main program.

A web server provides a different host environment for server-side computation including objects representing requests, clients, and files; and mechanisms to lock and share data. By using browser-side and server-side scripting together, it is possible to distribute computation between the client and server while providing a customized user interface for a Web-based application.

Each Web browser and server that supports ECMAScript supplies its own host environment, completing the ECMAScript execution environment.
  `,
  metadata: { source: "https://tc39.es/ecma262/#sec-web-scripting" },
});

const res = await chain.invoke({
  input: "what's web browser on es25",
  context: [documenta],
});
console.log(res);
