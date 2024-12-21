/* give us ability to connect our ai to external data sources like databases , text-files , apis , etc
we need to give to the model api key and when  we create am inctance of it.
 we can pass parameters like

modelName
temperature
maxRetries
maxOutputTokens:1000
verbose: true
model: "gemini-pro"
maxRetries: 3 means if the request fails it will retry 3 times


----- 
we can call an ai model after creating it by 
.invoke {for single input}
.batch {for multiple inputs}
.stream("") but it return a readable stream {chunks} 
streamLog("")

---
here we created our chat bot using langchain 
so we can now ask and recieve GENERIC answers

so we need to create a prompt template
steps : create a model , than create a prompt template , than create a chain to hook them together

-----
now we need to format our response using output parser
 to be able to control the structure and the format of our output
we did  string , array , structured output parser : object , more complex using zod
 --------
 now we want to do CHATTING WITH DOCUMENT USING RETRIEVAL CHAINS
to talk about something he cant answer we need to use RETRIEVAL CHAINS
-we need to do retrieval to feed the llm with context of a page
so we use documents and chain that allw us to use these documents as array
- the documents should not be manually created , instead we need to scrape the website or anything 
and then create the documents --document loader-- 
 
- we needed to use text splitter to split the text into chunks and send only the relevant chunks to the llm


#########################
for now we could create a model ask it generic questions, used prompt templates and 
controlled our output than we teach the model using documents and retrieval chains .
-1 now we loaded data using : Cheerio web base loader  
-2 split it into chunks using   : RecursiveCharacterTextSplitter for example
-3 create new embedding 
-4 create vector store using the embedding and the chunks
-5 create a retrieval chain ->use it to ask questions

#########################

- now we will add chat history to be able to have a conversation context 
- the chat history is array of objects that have a spesific schema
- we can do that using the template fromMessages 

#########################
-self reasoning Agent with Tools
for now we learned how to creatre chains that follow pre determined sequence specified by us 

agent : we can give it instruction and  dynamically determine the action to take and the sequence to follow
and we can assign tools to an agent and he will know when to use to complete the task 

we created and agent and tools 

--

now long term conversation Memory

runnable sequence : we can use it to create chains that follow a predefined sequence
connected to data base

*/
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp",
  temperature: 0,
  verbose: true,
  maxOutputTokens: 10,
});
const aiMsg = await llm.invoke(
  "i want to ask about the process of getting a remote job"
);

console.log(aiMsg);
