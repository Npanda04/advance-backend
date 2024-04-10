"use strict";
// import express from "express";
// import { createClient } from "redis"
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const client = createClient()
// const app = express()
// app.use(express.json())
// async function startServer(){
//     try {
//         await client.connect()
//         console.log("redis connected")
//         app.listen(3000, ()=>{
//             console.log("server is up n up and running")
//         })
//     } catch (error) {
//         console.log("fail to connect" , error)
//     }
// }
// startServer()
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
let number = 0;
client.on('error', (err) => console.log('Redis Client Error', err));
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
    number += 1;
    try {
        yield client.lPush("problems", JSON.stringify({ code, language, problemId, number }));
        // Store in the database
        res.status(200).send("Submission received and stored.");
    }
    catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Connected to Redis");
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
// Function to send POST request
function sendRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            problemId: number - 1,
            code: "someCode",
            language: "someLanguage"
        };
        try {
            yield axios_1.default.post('http://localhost:3000/submit', data);
            console.log('Request sent successfully');
        }
        catch (error) {
            console.error('Error sending request:', error);
        }
    });
}
// Send 100 requests
let requestCount = 0;
const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if (requestCount >= 100) {
        clearInterval(interval);
        console.log('All requests sent');
    }
    else {
        yield sendRequest();
        requestCount++;
    }
}), 1000);
startServer();
