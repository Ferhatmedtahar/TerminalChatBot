import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

//creating a modal than prompt than chain to hook it together
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
  verbose: true,
  maxOutputTokens: 1000,
});

//create a template string , for variables we use {variableName} than we use ChatPromptTemplate and await it

// const promptString = `roast for me {input} and make me laugh`;

//! method 1  : const prompt = ChatPromptTemplate.fromTemplate(promptString);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "roast for me {input} and make me laugh"],
  ["human", "{input}"],
]);
// console.log(await prompt.format({ input: "js" }));

//combine model and prmpt
const chain = prompt.pipe(model);
const res = await chain.invoke({ input: "algeria" });
console.log(res);
