import express from "express";
import cors from 'cors';
import 'express-async-errors';
import rateLimit from "express-rate-limit";
import {userRouter} from "./routers/userRouter";
import {errorHandler} from "./utils/error";
import cookieParser from "cookie-parser";

const app = express();

app
    .use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }))
    .use(cookieParser())
    .use(rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 10000,
    }))
    .use(express.json());

// express Routers....

app
    .use('/user', userRouter)

// express error handling
app.use(errorHandler)

app.listen(3001, '0.0.0.0', () => {
    console.log("Listening on http://localhost:3001")
});