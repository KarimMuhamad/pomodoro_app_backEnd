import express from 'express';
import {publicApi} from "../router/public-api";
import {errorMiddleware} from "../middleware/error-middleware";

import dotenv from "dotenv";
dotenv.config();

export const web = express();
web.use(express.json());
web.use(publicApi);
web.use(errorMiddleware);