import express from "express";
import {AuthController} from "../controller/auth-controller";
import {refreshTokenMiddleware} from "../middleware/refreshTokenMidlleware";

export const publicApi = express.Router();
publicApi.post('/auth/register', AuthController.register);
publicApi.post('/auth/login', AuthController.login);
publicApi.post('/auth/refresh', refreshTokenMiddleware, AuthController.refresh);
