import {Response, NextFunction} from "express";
import {AuthUserRequest, JWTDecoded} from "../type/auth-typeToken";
import { ResponseError } from "../error/response-error";
import jwt, {JwtPayload} from "jsonwebtoken";
import prisma from "../application/database";
import logging from "../application/logging";

export const authMiddleware = async (req: AuthUserRequest, res: Response,next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ status: 401, error: "Unauthorized" });

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTDecoded;
        console.log("iat:", decoded.iat, "exp:", decoded.exp, "now:", Date.now());

        const user = await prisma.user.findFirst({
            where: { id: decoded.id }
        });

        if (!user) return res.status(401).json({ status: 401, error: "Unauthorized" });

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next('TokenExpiredError');
        }
        return res.status(401).json({ status: 401, error: "Invalid token" });
    }
};