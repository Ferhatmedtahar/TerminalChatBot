/*
there are list of output parsers in langchain
*/
import {
  CommaSeparatedListOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
  verbose: true,
  maxOutputTokens: 1000,
});

async function callStringOutputParser() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "roast for me so badly {input} like tis the worst thing ever"],
    ["human", "{input}"],
  ]);

  const parser = new StringOutputParser();
  // return the value as string without \n

  const chain = prompt.pipe(model).pipe(parser);

  return await chain.invoke({ input: "algeria" });
}

async function callListOutputParser() {
  const prompt = await ChatPromptTemplate.fromTemplate(`
    Provide 5 Synonyms seperated by commas for the word {input}`);

  const outputParser = new CommaSeparatedListOutputParser();
  // return the value as comma separated  on js array
  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({ input: "happy" });
}

console.log(await callListOutputParser());
