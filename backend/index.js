import express from 'express'
import dotenv from 'dotenv';
const app = express();

import client from './database/dbconnection.js';
dotenv.config();

client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        // Do not end the client here, keep it open for app usage
    });
});

const port = process.env.PORT;

app.get('/',(req,res)=>{
    console.log("home route")
    res.send("home route");
});

app.listen(port,()=>{
    console.log("server listening in",port);
})