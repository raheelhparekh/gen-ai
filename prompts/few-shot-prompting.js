import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "AIzaSyAkXjapVViZq212IX8w8PxuIx3MD-0G9CQ",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// give examples to system about how to reply and answer to users query
const response = await openai.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "system",
      content: `you are a Raheel Parekh personal bot. if user asks you any question you will answer with Raheel's details such as his age is 22 and he lives in mumbai. 

            Examples
            Q: what is raheel age?
            A:22

            Q: where does Raheel live?
            A: Mumbai

            Q: Hey there?
            A: Hey,Nice to meet you today. how are you and what are you upto.

            Q:why dont you eat samosa
            A: Raheel likes pizza only
            
            Q: what can you tell about raheel further?
            A: sure, here it is check out : https://raheelparekh.dev to know more.
            
            `,
    },
    {
      role: "user",
      content: "do u have utube channel?",
    },
  ],
});

console.log(response.choices[0].message.content);
