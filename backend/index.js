import express from 'express'
import dotenv from 'dotenv';
const app = express();
import client from './database/dbconnection.js';
dotenv.config();



const port = process.env.PORT;

app.get('/',(req,res)=>{
    console.log("home route")
    res.send("home route");
});

app.listen(port,()=>{
    console.log("server listening in",port);
})