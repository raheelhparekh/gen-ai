import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function main() {
  const SYSTEM_PROMPT = `
  You are a step-by-step problem solver. You must think through problems systematically and output only ONE step at a time. 

  IMPORTANT: After each response, the user will continue the conversation and you must provide the NEXT step in the sequence.

  Rules:
  - Strictly follow the JSON output format
  - Always start with a START step to understand the problem
  - Use multiple THINK steps to work through the problem step by step  
  - End with an OUTPUT step containing the final answer
  - Return ONLY ONE JSON object per response
  - Each response must be valid JSON
  - Continue the step sequence based on your previous responses

  Step Sequence:
  1. START - Understand and state the problem
  2. THINK - Multiple thinking steps to solve step by step
  3. OUTPUT - Final answer

  Output JSON Format (choose ONE per response):
  {"step":"START","content":"description of the problem"}
  {"step":"THINK","content":"one thinking step"}
  {"step":"OUTPUT","content":"final answer"}

  Example for solving 3+4*10-4*3:
  Response 1: {"step":"START","content":"I need to solve 3+4*10-4*3 using order of operations"}
  Response 2: {"step":"THINK","content":"First, I'll do multiplication: 4*10=40"}
  Response 3: {"step":"THINK","content":"Next multiplication: 4*3=12, so now I have 3+40-12"}
  Response 4: {"step":"THINK","content":"Left to right: 3+40=43"}
  Response 5: {"step":"THINK","content":"Finally: 43-12=31"}
  Response 6: {"step":"OUTPUT","content":"The answer is 31"}
  `;

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: "HEY, CAN U write a code in js to add two numbers and also give the maximum of two numbers",
    },
  ];

  while (true) {
    try {
      const response = await openai.chat.completions.create({
        model: "gemini-2.5-flash",
        messages,
      });

      if (!response.choices || response.choices.length === 0) {
        console.error("No response choices returned from API");
        break;
      }

      const output = response.choices[0].message?.content;
      
      if (!output) {
        console.error("Empty response content");
        break;
      }

      let parsedOutput;
      try {
        parsedOutput = JSON.parse(output);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError.message);
        console.error("Raw output:", output);
        break;
      }

      // Add the assistant's response to the message array
      messages.push({
        role: "assistant",
        content: output
      });

      if(parsedOutput.step === "START"){
        console.log("✓ STARTED:", parsedOutput.content);
        // Add a user message to prompt the next step
        messages.push({
          role: "user", 
          content: "Continue with the next step"
        });
        continue;
      }

      if(parsedOutput.step === "THINK"){
        console.log("🤔 THINKING:", parsedOutput.content);
        // Add a user message to prompt the next step
        messages.push({
          role: "user", 
          content: "Continue with the next step"
        });
        continue;
      }

      if(parsedOutput.step === "OUTPUT"){
        console.log("🎯 OUTPUT:", parsedOutput.content);
        break;
      }

      console.log("❓ Unexpected step type:", parsedOutput.step);
      break;
    } catch (error) {
      console.error("Error:", error.message);
      if (error.response) {
        console.error("API Error Response:", error.response.data);
      }
      break;
    }
  }
}

main();
