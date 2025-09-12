import client from "./dbconnection.js";
import { create_transactions_table } from "./queries.js";

export const createTransactionTable = () => {
    client.query(create_transactions_table, (err, res) => {
        if (err) {
            console.error("Error creating transactions table:", err);
        } else {
            console.log("Transactions table created or already exists.");
        }   
    });
}
