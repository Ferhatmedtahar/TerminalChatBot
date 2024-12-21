import { tavily } from "@tavily/core";
import "dotenv/config";
// Step 1. Instantiating your Tavily client
const tvly = tavily();

// Step 2. Executing a simple search query
const response = await tvly.search("Who is Leo Messi?");

// Step 3. That's it! You've done a Tavily Search!
console.log(response);
