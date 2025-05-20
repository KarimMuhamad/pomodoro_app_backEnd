import express from "express";
import {AuthController} from "../controller/auth-controller";
import {refreshTokenMiddleware} from "../middleware/refreshTokenMidlleware";

export const publicApi = express.Router();
publicApi.post('/api/v1/auth/register', AuthController.register);
publicApi.post('/api/v1/auth/login', AuthController.login);
publicApi.post('/api/v1/auth/refresh', refreshTokenMiddleware, AuthController.refresh);
