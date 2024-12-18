import "dotenv/config";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

/*
search engines to search for things based on query
and filter also and paginate and sort and get spesific thing 
traditional search is trying to match keywords
google searrch can autocomplete 

semantic search : search for things that are similar to what you are looking for and try to understand 
the intent of the query 

we can do suggestion based on semantic search 

langchain : SDK for semantic search
handle alot of things

# we need to udnerstand Embedding and Vercotrs
it turn words into numbers and arrays and vectors and visualizate them and the closer
they are the more similar they are

# save vectors + 

*/

const movies = [
  {
    id: 1,
    title: "Stepbrother",
    description: `Comedic journey full of adult humor and awkwardness.`,
  },
  {
    id: 2,
    title: "The Matrix",
    description: `Deals with alternate realities and questioning what's real.`,
  },
  {
    id: 3,
    title: "Shutter Island",
    description: `A mind-bending plot with twists and turns.`,
  },
  {
    id: 4,
    title: "Memento",
    description: `A non-linear narrative that challenges the viewer's perception.`,
  },
  {
    id: 5,
    title: "Doctor Strange",
    description: `Features alternate dimensions and reality manipulation.`,
  },
  {
    id: 6,
    title: "Paw Patrol",
    description: `Children's animated movie where a group of adorable puppies save people from all sorts of emergencies.`,
  },
  {
    id: 7,
    title: "Interstellar",
    description: `Features futuristic space travel with high stakes`,
  },
];

const createStore = () =>
  MemoryVectorStore.fromDocuments(
    movies.map(
      (movie) =>
        new Document({
          pageContent: `Title: ${movie.title}\n${movie.description}`,
          metadata: { source: movie.id, title: movie.title },
        })
    ),
    new OpenAIEmbeddings()
  );

export const search = async (query, count = 1) => {
  const store = await createStore();
  return store.similaritySearch(query, count);
};

console.log(await search("cute and furry"));

/*


we can implement semantic search on movie database , so if we know some metadata like actor or year 
or similar meeaning to the movie title we can find it 

not like traditional search that is trying to match keywords

we can discover things and similar things . it make users happy 


we bring the data aand its metadata and each object of data we turn it into document

so our query string turn into numbers and vector and search and calculate based on that 

duplicated databases
*/
