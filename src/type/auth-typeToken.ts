import {AuthResponse} from "../model/auth-model";
import {Request} from "express";
import {User} from "@prisma/client";

export interface AuthTypeToken {
    authRes: AuthResponse;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    refreshTokenExpires: number;
}

export interface AuthUserRequest extends Request {
    user?: User;
}

export interface JWTDecoded {
    id: number;
    iat: number;
    exp: number;
}