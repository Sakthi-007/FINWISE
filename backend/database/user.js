import client from "./dbconnection.js";
import { create_user_table } from "./queries.js";


export const createUserTable = () => {
    client.query(create_user_table, (err, res) => {
        if (err) {
            console.error("Error creating users table:", err);
        } else {
            console.log("Users table created or already exists.");
        }
    });
}
