/*
LLM are powerful and have huge knowledge base
however they cant know anything beyond what they are trained on
and they dotn activelly browse the net and cant pull currect events and real time data
so we need dynamic soltions
-----------------------------------------------
function calling
the llm instruct other system to do some task 

llm+ function calling 
this combination will allow us to fix the gap between static knowlodge and ever-growing data

so for example llm dont know the score of the today fotball game
but it can instruct a function to fetch that data

all the implecations 
## dont trust users and ai 


----
define messages array for history
object of functions {f1:calc(exp){}}
and insdie the creation of chat completions we pass the model , messages and functions
and the llm will know how to call the function
*/
