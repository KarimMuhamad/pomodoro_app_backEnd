import {Request, Response, NextFunction, request, response} from "express";
import {LoginAuthRequest, RegisterAuthRequest} from "../model/auth-model";
import {AuthService} from "../service/auth-service";
import logging from "../application/logging";

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
            logging.warn(`User registration failed : ${e.message}`, {request: req.body});
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request:LoginAuthRequest = req.body as LoginAuthRequest;
            const response = await AuthService.login(request, req.headers['user-agent'] as string);

            res.cookie('accesToken', response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: response.accessTokenExpires,
            });

            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/v1/auth/refresh',
                maxAge: 1000 * 60 * 60 * 24 * 30,
            })

            res.status(200).json({
                status: 200,
                message: 'SuccessFully logged in',
                data: response.authRes,
            });

            logging.info('User logged in', {
                username: request.username,
                email: request.email!.replace(/(?<=.).(?=[^@]*@)/g, '*'),
            });

        } catch (e) {
            next(e);
            logging.warn(`User login failed : ${e.message}`, {request: req.body});
        }
    }

}