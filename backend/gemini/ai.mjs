import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
// console.log(process.env);
const key = process.env.GEMINI_API_KEY;
// console.log(key);
const ai = new GoogleGenAI({apiKey: key});

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: 'Why is the sky blue?',
  });
  console.log(response.text);
}

export default main;