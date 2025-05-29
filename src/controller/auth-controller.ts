import {Request, Response, NextFunction, request, response} from "express";
import {LoginAuthRequest, RegisterAuthRequest} from "../model/auth-model";
import {AuthService} from "../service/auth-service";
import logging from "../application/logging";
import {AuthUserRequest, JWTDecoded} from "../type/auth-typeToken";
import jwt from "jsonwebtoken";

export class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterAuthRequest = req.body as RegisterAuthRequest;
            const response = await AuthService.register(request);
            res.status(201).json({
                status: 201,
                message: 'SuccessFully registered',
                data: response,
            });
            logging.info('User registered', {
                username: request.username,
                email: request.email.replace(/(?<=.).(?=[^@]*@)/g, '*'),
            });
        } catch (e) {
            next(e);
            logging.warn(`User registration failed : ${e}`, {request: req.body});
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request:LoginAuthRequest = req.body as LoginAuthRequest;
            const response = await AuthService.login(request, req.headers['user-agent'] as string);

            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });

            res.status(200).json({
                status: 200,
                message: 'SuccessFully logged in',
                data: response.authRes,
                accessToken: response.accessToken,
                expiresIn: response.accessTokenExpires,
            });

            logging.info('User logged in', {
                username: request.username,
                email: request.email?.replace(/(?<=.).(?=[^@]*@)/g, '*'),
            });

        } catch (e) {
            next(e);
            logging.warn(`User login failed : ${e}`, {request: req.body});
        }
    }

    static async logout(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const response = await AuthService.logout(req.user!);
            res.clearCookie('refreshToken');
            res.status(200).json({
                status: 200,
                message: 'OK',
            });

            logging.info('User logged out', {
                username: req.user!.username,
            });
        } catch (e) {
            next(e);
            logging.warn(`User logout failed : ${e}`, {request: req.body});
        }
    }

    static async refresh(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const response = await AuthService.generateAccessToken(req.user!);
            res.status(200).json({
                status: 200,
                message: 'OK',
                data: response.authRes,
                accessToken: response.accessToken,
                expiresIn: response.accessTokenExpires,
            });

            logging.info('User refresh token', {
                username: response.authRes.username,
            });
        } catch (e) {
            next(e);
            logging.warn(`User generate token failed : ${e}`, {request: req.body});
        }
    }
}