import express from 'express';
import {publicApi} from "../router/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
import {apiRouter} from "../router/api";
dotenv.config();

const BASE_PATH = process.env.BASE_PATH as string;
export const web = express();
web.use(cors({
   origin: 'http://localhost:5173',
   credentials: true,
}));

web.use(express.json());
web.use(cookieParser());

const baseUrl = express.Router();
baseUrl.use(publicApi);
baseUrl.use(apiRouter);
web.use(BASE_PATH, baseUrl);

web.use(errorMiddleware);
