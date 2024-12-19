/*
there are list of output parsers in langchain
StringOutputParser string
CommaSeparatedListOutputParser array of strings js
StructuredOutputParser : to convert a string to object and for example json to communicate

for more complcated object we use zod schema


*/
import {
  CommaSeparatedListOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

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

async function callStructuredOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    extract the name and age of the person from this sentence {input} , formatting :{json} `);

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    age: "the age of the person",
    country: "the country of the person",
  });
  // return
  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({
    input: "my name is tahar and im 20 years old",
    json: outputParser.getFormatInstructions(),
  });
}

async function callZodOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    extract the ingredients from this recipe {input} , formatting :{json} `);

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
    })
  );
  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({
    input: "bread is easy to make , you need flour and water and oil and salt",
    json: outputParser.getFormatInstructions(),
  });
}
console.log(await callZodOutputParser());
