/* give us ability to connect our ai to external data sources like databases , text-files , apis , etc
we need to give to the model api key and when  we create am inctance of it we can pass parameters like

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
