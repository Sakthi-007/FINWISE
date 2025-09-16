import client from "./dbconnection.js";
import { create_transactions_table, insert_transaction,get_transactions_by_month,get_transactions_by_category,get_all_transactions } from "./queries.js";
import fs from "fs";

export const createTransactionTable = () => {
    client.query(create_transactions_table, (err, res) => {
        if (err) {
            console.error("Error creating transactions table:", err);
        } else {
            console.log("Transactions table created or already exists.");
        }   
    });
}

export async function insertTransactions(transactions) {
    try {
        // Begin transaction
        await client.query('BEGIN');
        
        for (const transaction of transactions) {
            
            await client.query(insert_transaction, [
                1, // Assuming user_id is 1 for demonstration; replace with actual user_id
                transaction.date,
                transaction.amount,
                transaction.category,
                transaction.description,
                transaction.type
            ]);
        }
        
        // Commit transaction
        await client.query('COMMIT');
        console.log(`Successfully inserted ${transactions.length} transactions`);
    } catch (err) {
        // Rollback in case of error
        await client.query('ROLLBACK');
        console.error('Error inserting data:', err.message);
    }
}


export async function fetchTransactionsByMonth(userId, year, month) {
    try {
        const res = await client.query(get_transactions_by_month, [userId, year, month]);
        return res.rows;
    } catch (err) {
        console.error('Error fetching transactions by month:', err.message);
        return [];
    }
}

export async function fetchTranscationsByCategory(userId,categories){
try{
    categories=`${categories}%`;
    const res = await client.query(get_transactions_by_category,[userId,categories]);
    return res.rows;
}
catch(err){
    console.error('Error fetching by categories',err.message);
    return [];
}

} 

export async function fetchAllTransactions(userId){
    try{
        const res= await client.query(get_all_transactions,[userId]);
        return res.rows;
    
    }catch(err){
        console.error('Error in fetching all ',err.message)
    }
}