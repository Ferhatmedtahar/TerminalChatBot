import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import readline from "node:readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//memory , buffer memory will be lost once the session ends
// import { ConversationChain } from "langchain/chains";

import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { BufferMemory } from "langchain/memory";

//this is storing all the chat history from my messages to the llm messages
//  const memory = new BufferMemory({
//   memoryKey: "history",
// });

import { RunnableSequence } from "@langchain/core/runnables";

const memory = new BufferMemory({
  memoryKey: "history",
  chatHistory: new UpstashRedisChatMessageHistory({
    sessionId: new Date().toISOString(), // Or some other unique identifier for the conversation
    sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
    config: {
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    },
  }),
});

//!####################################################################################
const model = new ChatGoogleGenerativeAI();
const prompt = ChatPromptTemplate.fromTemplate(`
  you are an ai assistant 
  {input}
  History:{history}
  `);

//with no history
// const chain = prompt.pipe(model);

//using the Chain Classes
// const chain = new ConversationChain({
//   llm: model,
//   memory,
//   prompt,
// });

const chain = RunnableSequence.from([
  {
    input: (inital) => inital,
    memory: () => memory.loadMemoryVariables(),
  },
  {
    input: (previnital) => previnital.input,
    history: (prevoutput) => prevoutput.memory.history,
  },
  prompt,
  model,
]);

async function handleUserInput() {
  rl.question("User: ", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }
    try {
      const res = await chain.invoke({
        input: userInput,
      });

      const out = res.content;
      console.log(`AI:${out}`);

      await memory.saveContext(
        { input: userInput },
        {
          output: out,
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
    // Continue the conversation recursively
    handleUserInput();
  });
}

// Start the conversation
handleUserInput();
/*

FIRST METHOD
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import readline from "node:readline";
//memory , buffer memory will be lost once the session ends
import { ConversationChain } from "langchain/chains";

import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { BufferMemory } from "langchain/memory";

//this is storing all the chat history from my messages to the llm messages
//  const memory = new BufferMemory({
//   memoryKey: "history",
// });

const memory = new BufferMemory({
  memoryKey: "history",
  chatHistory: new UpstashRedisChatMessageHistory({
    sessionId: new Date().toISOString(), // Or some other unique identifier for the conversation
    sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
    config: {
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    },
  }),
});

//!####################################################################################
const model = new ChatGoogleGenerativeAI();
const prompt = ChatPromptTemplate.fromTemplate(`
  you are an ai assistant 
  {input}
  History:{history}
  `);
//with no history
// const chain = prompt.pipe(model);

//using the Chain Classes
const chain = new ConversationChain({
  llm: model,
  memory,
  prompt,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function handleUserInput() {
  rl.question("User: ", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }
    try {
      const res = await chain.invoke({
        input: userInput,
      });
      console.log(`AI: ${res.response}`);
    } catch (error) {
      console.error("Error:", error);
    }
    // Continue the conversation recursively
    handleUserInput();
  });
}

// Start the conversation
handleUserInput();



*/
