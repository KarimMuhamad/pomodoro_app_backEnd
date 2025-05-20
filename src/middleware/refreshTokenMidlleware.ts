import {Request, Response, NextFunction} from "express";
import {AuthUserRequest, JWTDecoded} from "../type/auth-typeToken";
import prisma from "../application/database";
import jwt from "jsonwebtoken";

export const refreshTokenMiddleware = async (err: any, req: AuthUserRequest, res: Response, next: NextFunction) => {
    if (err === 'TokenExpiredError') {
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) return res.status(401).json({ status: 401, error: "No Refresh Token" });

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH as string) as JWTDecoded;
            const user = await prisma.user.findFirst({
                where: { id: decoded.id }
            });

            if (!user) return res.status(401).json({ status: 401, error: "User not found" });
            req.user = user;

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {expiresIn: '3s'});
            console.log(token);
            res.setHeader('authorization', `Bearer ${token}`);
            next();
        } catch (err) {
            return res.status(401).json({ status: 401, error: "Access Denied" });
        }
    }

    return;
};
