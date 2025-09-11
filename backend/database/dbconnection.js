import fs from 'fs';
import { Client } from 'pg';
import url from 'url';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: "avnadmin",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA,
    }
}

const client = new Client(config);


export default client;