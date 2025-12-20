import { Router } from "express";
import { fetchTransactionsByMonth,fetchTranscationsByCategory,fetchAllTransactions } from "../database/transactions.js";
const router = Router();


router.get('/getTransactionsByMonth/:userId/:year/:month',async(req,res)=>{
try{
    const {userId,year,month} = req.params;
    const transactions = await fetchTransactionsByMonth(userId, year, month);
    res.status(200).json(transactions);
}catch(err){
    console.error('Error fetching transactions by month:', err.message);
    res.status(500).json({ message: err.message });
}
})

router.get('/getTransactionsByCategory/:userId/:categories',async(req,res)=>{
    try{
        const {userId,categories} = req.params;
    const transactions =await fetchTranscationsByCategory(userId,categories);
    res.status(200).json(transactions);
    }
    catch(err){
        console.error('Error fetching by categories',err.message);
        res.status(500).json({ message: err.message });
    }
})

router.get('/getAllTransactions/:userId',async(req,res)=>{
    try{
        const {userId}=req.params;
        const transactions=await fetchAllTransactions(userId);
        res.status(200).json(transactions);
    }
    catch(err){
        console.error('Error fetching all transactions',err.message);
        res.status(500).json({ message: err.message });
    }   
})


export default router;