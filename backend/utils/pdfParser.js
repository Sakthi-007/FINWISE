import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create a custom wrapper for pdf-parse that doesn't rely on test files
const pdfParse = async (dataBuffer) => {
  try {
    // Dynamically import pdf-parse only when needed
    const pdfParseModule = await import('pdf-parse');
    const parse = pdfParseModule.default;
    
    // Call pdf-parse with the provided buffer
    return await parse(dataBuffer);
  } catch (error) {
    if (error.code === 'ENOENT' && error.path.includes('test/data')) {
      // This is the error from missing test files, we can safely ignore it
      // and try again with a custom approach
      
      // Dynamically import the core parsing function
      const pdfParseModule = await import('pdf-parse/lib/pdf-parse.js');
      const parsePdf = pdfParseModule.default;
      
      // Call the parser directly with the buffer
      return await parsePdf(dataBuffer);
    }
    
    // For other errors, rethrow
    throw error;
  }
};

export default pdfParse;