// import express from "express";
// import { createClient } from "redis"

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


import express from "express";
import { createClient } from "redis";
import axios from 'axios';

const app = express();
app.use(express.json());

const client = createClient();

let number = 0
client.on('error', (err) => console.log('Redis Client Error', err));

app.post("/submit", async (req, res) => {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
    number+=1

    try {
        await client.lPush("problems", JSON.stringify({ code, language, problemId , number}));
        // Store in the database
        res.status(200).send("Submission received and stored.");
    } catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
});

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}




// Function to send POST request
async function sendRequest() {
    const data = {
        problemId: number,
        code: "someCode",
        language: "someLanguage"
    };

    try {
        await axios.post('http://localhost:3000/submit', data);
        console.log('Request sent successfully');
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

// Send 100 requests
let requestCount = 0;
const interval = setInterval(async () => {
    if (requestCount >= 100) {
        clearInterval(interval);
        console.log('All requests sent');
    } else {
        await sendRequest();
        requestCount++;
    }
}, 1000);

startServer();