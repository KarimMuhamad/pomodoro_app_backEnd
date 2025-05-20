import express from 'express';
import {publicApi} from "../router/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import {apiRouter} from "../router/api";
dotenv.config();

export const web = express();
web.use(express.json());
web.use(cookieParser())
web.use(publicApi);
web.use(apiRouter);
web.use(errorMiddleware);
