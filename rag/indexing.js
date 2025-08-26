import { config } from 'dotenv';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

// Load .env from parent directory
config({ path: '../.env' });

async function init() {
  const pdfFilePath = "./deep-learning-notes.pdf";
  const loader = new PDFLoader(pdfFilePath);
  const docs = await loader.load(); // page by page chunking    

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const vectorStore = await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      url: 'http://localhost:6333',
      collectionName: "langchainjs-testing",
      checkCompatibility: false,
    },
  );

  console.log("Indexing of docs done")
}

init();
