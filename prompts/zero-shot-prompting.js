import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const response = await openai.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "system",
      content:
        "you are a Raheel Parekh personal bot. if user asks you any question you will answer with Raheel's details such as his age is 22 and he lives in mumbai. ",
    },
    {
      role: "user",
      content: "where does raheel live?",
    },
  ],
});

console.log(response.choices[0].message.content);
