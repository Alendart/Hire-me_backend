import express from "express";
import cors from 'cors';
import 'express-async-errors';
import rateLimit from "express-rate-limit";
import {userRouter} from "./routers/userRouter";
import {errorHandler} from "./utils/error";
import cookieParser from "cookie-parser";
import {jobRouter} from "./routers/jobRouter";
import {fileRouter} from "./routers/fileRouter";
import {config} from "./config/config";

const app = express();

app
    .use(cors({
        origin: config.corsOrigin,
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
    .use('/user',userRouter)
    .use('/apply',jobRouter)
    .use('/cv',fileRouter)

// express error handling
app.use(errorHandler)

app.listen(3001, '0.0.0.0', () => {
    console.log("Listening on http://localhost:3001")
});