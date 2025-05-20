import {AuthResponse, LoginAuthRequest, RegisterAuthRequest, toAuthResponse} from "../model/auth-model";
import {Validation} from "../validation/validation";
import {AuthValidation} from "../validation/auth-validation";
import prisma from "../application/database";
import {ResponseError} from "../error/response-error";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {AuthTypeToken} from "../type/auth-typeToken";
import now = jest.now;
import {User} from "@prisma/client";

export class AuthService {

    static async register(req: RegisterAuthRequest) : Promise<AuthResponse> {
        const resgisterRequest = Validation.validate(AuthValidation.REGISTER, req);

        const totalUserWithSameUsername = await prisma.user.count({
            where: {
                username: resgisterRequest.username
            }
        });

        if (totalUserWithSameUsername > 0) {
            throw new ResponseError(400, 'Username already exists');
        }

        const totalUserWithSameEmail = await prisma.user.count({
            where: {
                email: resgisterRequest.email
            }
        });

        if (totalUserWithSameEmail > 0) {
            throw new ResponseError(400, 'Email already exists');
        }

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
                            color: "#808080"
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

        const accesTokenExpires = Date.now() + 1000 * 60 * 15;
        const refreshTokenExpires = Date.now() + 1000 * 60 * 60 * 24 * 30;

        const payload = {id: user.id};

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '3s'});
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
            accessTokenExpires: accesTokenExpires,
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
}