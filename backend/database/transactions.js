import client from "./dbconnection.js";
import { create_transactions_table, insert_transaction } from "./queries.js";
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