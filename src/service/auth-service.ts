import {AuthResponse, LoginAuthRequest, RegisterAuthRequest, toAuthResponse} from "../model/auth-model";
import {Validation} from "../validation/validation";
import {AuthValidation} from "../validation/auth-validation";
import prisma from "../application/database";
import {ResponseError} from "../error/response-error";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {AuthTypeToken, JWTDecoded} from "../type/auth-typeToken";
import {User} from "@prisma/client";
import logging from "../application/logging";
import { info } from "winston";

export class AuthService {

    static async register(req: RegisterAuthRequest) : Promise<AuthResponse> {
        const resgisterRequest = Validation.validate(AuthValidation.REGISTER, req);

        const isUsernameExist = await prisma.user.findUnique({
            where: {
                username: resgisterRequest.username
            }
        });

        if (isUsernameExist) throw new ResponseError(409, 'Username already exists');

        const isEmailExist = await prisma.user.findUnique({
            where: {
                email: resgisterRequest.email
            }
        });

        if (isEmailExist) throw new ResponseError(409, 'Email already exists');

        resgisterRequest.password = await argon2.hash(resgisterRequest.password);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username: resgisterRequest.username,
                    email: resgisterRequest.email,
                    password: resgisterRequest.password,
                    UserPreferences: {
                        create: {}
                    },
                    Label: {
                        create: {
                            name: "UnLabelled",
                            color: "#808080",
                            isDefault: true
                        }
                    }
                }
            });

            return toAuthResponse(user)
        });

        return result;
    }
    
    static async login(req: LoginAuthRequest, deviceInfo?:string) : Promise<AuthTypeToken> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, req);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: loginRequest.username},
                    {email: loginRequest.email}
                ]
            }
        });

        if (!user) {
            throw new ResponseError(401, "Username or email is wrong");
        }

        const isPasswordValid = await argon2.verify(user.password, loginRequest.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Password is wrong");
        }

        const accessTokenExpires = Date.now() + 1000 * 60 * 20;
        const refreshTokenExpires = Date.now() + 1000 * 60 * 60 * 24 * 30;

        const payload = {id: user.id};

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '20m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH!, {expiresIn: "30d"});

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                deviceInfo: deviceInfo || 'Unknown',
                expiredAt: new Date(refreshTokenExpires)
            }
        });

        return {
            authRes: toAuthResponse(user),
            accessToken: token,
            accessTokenExpires: accessTokenExpires,
            refreshToken: refreshToken,
            refreshTokenExpires: refreshTokenExpires
        };
    }

    static async logout(user: User) : Promise<AuthResponse> {
        const refreshToken = await prisma.refreshToken.findFirst({
            where: {
                userId: user.id,
            }
        });

        await prisma.refreshToken.delete({
            where: {
                id: refreshToken?.id
            }
        });

        return toAuthResponse(user);
    }

    static async generateAccessToken(user:User) : Promise<AuthTypeToken> {
        const accessTokenExpires = Date.now() + 1000 * 60 * 20;

        const payload = {id: user!.id};
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '20m'});

        return {
            authRes: toAuthResponse(user),
            accessToken: token,
            accessTokenExpires: accessTokenExpires,
        };
    }
}