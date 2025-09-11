const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const port = process.env.PORT;

app.get('/',(req,res)=>{
    console.log("home route")
    res.send("home route");
});

app.listen(port,()=>{
    console.log("server listening in",port);
})