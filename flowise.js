/*easy to create chat bots that are able to answer questions from our own data sources 
like pdf , text files , databases , websites ,..ect
like personal bot

RAG : Retrieval Augmented Generation

if we ask chat gpt for example 
whats the current weather or how to deploy a website on new platform
the asnswer will be wrong since its new and not included in the ai model data was trained on 
so it will do assumptions and give wrong answer

instead we could comand it and give it `CONTEXT ` and `USER QUESTION` to answer on a propmpt 

!the context ofc , should not be hardCoded  
so+++FLOWISE WILL retrieve the context from DATA SOURCE and inject it+++

so : SOURCE --> LOAD --> TEXT SPLITTER --> EMBEDDING --> VECTOR STORE --> RETRIEVE 

 we load one giant document and split it into smaller chunks to reduce the usage of token
 pass it through embedding and store it in vector store to search based on the meaning of the data
 than passing it 

 its a  good service , but we dont really need it for now 
 */
