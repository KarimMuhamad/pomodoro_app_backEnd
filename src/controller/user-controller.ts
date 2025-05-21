import {AuthUserRequest} from "../type/auth-typeToken";
import {Response, NextFunction} from "express";
import {AuthService} from "../service/auth-service";
import {UserService} from "../service/user-service";
import {UpdateUserRequest} from "../model/users-model";

export class UserController {

    static async getUsers(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getUsers(req.user!);
            res.status(200).json({
                status: 200,
                message: 'SuccessFully get users',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateUsers(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRequest = req.body as UpdateUserRequest;
            const response = await UserService.updateUser(request, req.user!);
            res.status(200).json({
                status: 200,
                message: 'SuccessFully update user',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async deleteUsers(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.deleteUser(req.user!);
            res.status(200).json({
                status: 200,
                message: 'OK'
            });
        } catch (e) {
            next(e);
        }
    }

}