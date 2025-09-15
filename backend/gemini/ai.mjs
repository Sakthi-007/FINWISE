import {GoogleGenAI,Type} from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import { type } from 'os';
import { insertTransactions } from '../database/transactions.js';
// import pdfParse from '../utils/pdfParser';
dotenv.config();
const key = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({apiKey: key});

const prompt =`You are a financial data extraction specialist analyzing a bank statement PDF. 
Extract ALL transactions found in this statement and categorize each one.

IMPORTANT: You MUST categorize each transaction into EXACTLY ONE of these 10 categories:
1. Housing
2. Food
3. Transportation
4. Utilities
5. Insurance
6. Healthcare
7. Savings/Investment
8. Personal Spending
9. Entertainment
10. Miscellaneous

DO NOT create any new categories beyond these 10. If a transaction doesn't clearly fit into the first 9 categories, use "Miscellaneous".

For each transaction, provide:
1. Date (in YYYY-MM-DD format)
2. Description (the merchant name or transaction description)
3. Amount (as a number, use negative for debits/spending and positive for credits/income)
4. Category (ONLY ONE of the 10 categories listed above)

Return ONLY a JSON object with this exact structure:
{
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "Transaction description",
      "amount": 123.45,
      "category": "Category"
    }
  ]
}

return a json object in the response
`
export async function processStatement(pdfBuffer) {

  const base64Pdf=pdfBuffer.toString('base64');

  console.log("Data send to Gemini");
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { 
                mimeType: "application/pdf", 
                data: base64Pdf 
              } 
            }
          ]
        }
      ],
      config:{
        responseMimeType: "application/json",
        responseSchema:{
          type:Type.ARRAY,
          items:{
            type:Type.OBJECT,
            properties:{
              date:{type:Type.STRING,description:"Transaction date in YYYY-MM-DD format"},
              description:{type:Type.STRING,description:"Transaction description give the entire description"},
              amount:{type:Type.NUMBER,description:"Transaction amount"},
              category:{type:Type.STRING,description:"Transaction category"},
              type:{type:Type.STRING,description:"income or expense"}
            }
          }
          }
      }
      ,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      }
  });


// const a = fs.readFileSync('res.txt','utf-8');
// const transactions = JSON.parse(a);
// console.log(transactions);
const transaction = JSON.parse(response.text);
console.log(transaction);
insertTransactions(transaction);
// console.log(response.text);
// insertTransactions(transactions);
fs.writeFileSync('res.txt',response.text)

// console.log("Wait is over");
// console.log("Response Text:",response);
//   return response.text;

  }
  // console.log(response.text);
