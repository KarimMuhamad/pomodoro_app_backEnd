import express from "express";
import {AuthController} from "../controller/auth-controller";

export const publicApi = express.Router();
publicApi.post('/api/v1/auth/register', AuthController.register);
publicApi.post('/api/v1/auth/login', AuthController.login);