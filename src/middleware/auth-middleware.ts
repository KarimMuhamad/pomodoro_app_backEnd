import {Response, NextFunction} from "express";
import {AuthUserRequest, JWTDecoded} from "../type/auth-typeToken";
import jwt, {JwtPayload} from "jsonwebtoken";
import prisma from "../application/database";
import { ResponseError } from "../error/response-error";

export const authMiddleware = async (req: AuthUserRequest, res: Response,next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] as string;

    if(!token) throw new ResponseError(401, "Unauthorized No Token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTDecoded;
    const user = await prisma.user.findUnique({
        where: { id: decoded.id }
    });

    if (!user) throw new ResponseError(401, "Unauthorized");

    req.user = user;
    next();
};