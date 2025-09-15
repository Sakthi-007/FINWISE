import express from 'express'
import dotenv from 'dotenv';
// import client from './database/dbconnection.js';
import cors from 'cors';
import multer from 'multer';
import { processStatement } from './gemini/ai.mjs';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

app.post("/upload",upload.single('pdfFile'),async(req,res)=>{
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    // req.file.buffer contains the PDF file as a Buffer
    const pdfBuffer = req.file.buffer;
    
    // Process the PDF with Gemini
    const result = await processStatement(pdfBuffer);
    console.log("Received response from Gemini");
    res.status(200).json(result);
    console.log('status 200');
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: error.message });
  }


});

app.get('/',(req,res)=>{
    console.log("home route")
    res.send("home route");
});

app.listen(port,()=>{
    console.log("server listening in",port);
})
