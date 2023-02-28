import express from "express";
import cors from 'cors';
import 'express-async-errors';
import rateLimit from "express-rate-limit";

const app = express();

app
    .use(cors({
        origin: 'http://localhost:3000',
    }))
    .use(rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 1000,
    }))
    .use(express.json());

// express Routers....


// express error handling

app.listen(3001, '0.0.0.0', () => {
    console.log("Listening on http://localhost:3001")
});