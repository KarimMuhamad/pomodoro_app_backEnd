import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {AuthController} from "../controller/auth-controller";
import {UserController} from "../controller/user-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.delete('/api/v1/auth/logout', AuthController.logout);

// User Endpoint
apiRouter.get('/api/v1/users/me', UserController.getUsers);
apiRouter.patch('/api/v1/users/me', UserController.updateUsers);
apiRouter.delete('/api/v1/users/me', UserController.deleteUsers);