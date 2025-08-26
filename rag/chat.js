import { config } from 'dotenv';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";


config({ path: '../.env' });

const client = new OpenAI();

async function chat() {
  const userQuery = "What is Node js";

  // step1 : make vector embeddings of user query
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "langchainjs-testing",
      checkCompatibility: false,
    },
  );

  const vectorSearcher = vectorStore.asRetriever({
    k: 3, // top k chunks to return
  });

  const relevantChunk = await vectorSearcher.invoke(userQuery);

  const SYSTEM_PROMPT=`
  You are an AI Assistant who helps resolving user query based on context available to you from a PDF File with the content and page number.
  Only answer based on available context to you from pdf file only.
  
  Context: ${JSON.stringify(relevantChunk)}
  `;

  const response= await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

chat();