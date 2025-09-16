import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/routes.js'
import { createTransactionTable } from './database/transactions.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

// Initialize database tables
createTransactionTable();

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'FINWISE API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Use API routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`server listening in ${port}`);
});

export default app;


app.listen(port,()=>{
    console.log("server listening in",port);
})
