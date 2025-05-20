import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {AuthController} from "../controller/auth-controller";
import {refreshTokenMiddleware} from "../middleware/refreshTokenMidlleware";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.delete('/api/v1/auth/logout', AuthController.logout);