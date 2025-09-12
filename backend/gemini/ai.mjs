// import { GoogleGenAI } from "@google/genai";
// import * as fs from 'fs';

// const prompt = 'analyze this bank statement and create a visual representation of the spendings using mermaid for html';

// const ai = new GoogleGenAI({ apiKey: "AIzaSyALFX95TZCUhULPHVGKkHHygH-49Alb-d0" });

// async function main() {
//     const contents = [
//         { text: prompt }
//     ];

//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         prompt: "You are a helpful assistant that creates mermaid diagrams for HTML based on user prompts."

//     });
//     console.log(response.text);
// }

// main();

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