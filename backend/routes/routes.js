import { Router } from "express";
import { fetchTransactionsByMonth,fetchTranscationsByCategory,fetchAllTransactions,insertTransactions } from "../database/transactions.js";
import multer from 'multer';
import { processStatement } from '../gemini/ai.mjs';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Upload and process bank statement
router.post('/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    console.log(`Processing PDF file: ${req.file.originalname}`);
    
    // Process the PDF with Gemini
    const result = await processStatement(req.file.buffer);
    console.log('Back to routes.js result:', result);
    // Insert transactions into database
    if (result.length > 0) {
      await insertTransactions(result);
      console.log(`Inserted ${result.length} transactions into database`);
    }
    
    res.status(200).json({
      success: true,
      message: `Successfully processed ${result.length} transactions`,
      data: result
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get all transactions for a user
router.get('/transactions/all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await fetchAllTransactions(userId);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching all transactions:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get transactions by month
router.get('/transactions/:userId/:year/:month', async (req, res) => {
  try {
    const { userId, year, month } = req.params;
    const transactions = await fetchTransactionsByMonth(userId, year, month);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions by month:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get transactions by category
router.get('/transactions/category/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { category } = req.query;
    const transactions = await fetchTranscationsByCategory(userId, category);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching by categories:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Generate financial report
router.post('/reports/generate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { dateRange, categories, reportType } = req.body;
    
    const transactions = await fetchAllTransactions(userId);
    
    // Process report data
    const reportData = {
      summary: {
        totalTransactions: transactions.length,
        totalIncome: transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        totalExpense: transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      },
      categoryBreakdown: {},
      monthlyTrends: {},
      insights: []
    };
    
    // Calculate category breakdown
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (!reportData.categoryBreakdown[category]) {
        reportData.categoryBreakdown[category] = {
          income: 0,
          expense: 0,
          count: 0
        };
      }
      
      if (transaction.type === 'income') {
        reportData.categoryBreakdown[category].income += parseFloat(transaction.amount);
      } else {
        reportData.categoryBreakdown[category].expense += parseFloat(transaction.amount);
      }
      reportData.categoryBreakdown[category].count += 1;
    });
    
    res.status(200).json({
      success: true,
      data: reportData,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error generating report:', err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;