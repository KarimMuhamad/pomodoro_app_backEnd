import {Request, Response, NextFunction} from "express";
import {AuthUserRequest, JWTDecoded} from "../type/auth-typeToken";
import prisma from "../application/database";
import jwt from "jsonwebtoken";
import {ResponseError} from "../error/response-error";

export const refreshTokenMiddleware = async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies['refreshToken'];

    // if (!refreshToken) throw new ResponseError(401, "Unauthorized No Refresh Token");
    // const isRefreshTokeninDB = await prisma.refreshToken.findUnique({
    //     where: {
    //         token: refreshToken
    //     }
    // });
    //
    // if (!isRefreshTokeninDB) throw new ResponseError(401, "Unauthorized Refresh Token in DB");

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH as string) as JWTDecoded;
    const user = await prisma.user.findUnique({
        where: { id: decoded.id }
    });
    if (!user) throw new ResponseError(401, "Unauthorized");
    req.user = user;
    next();
};
