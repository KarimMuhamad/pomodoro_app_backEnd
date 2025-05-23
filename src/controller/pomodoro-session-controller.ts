import { PomodoroSessionService } from "../service/pomodoro-session-service";
import { AuthUserRequest } from "../type/auth-typeToken";
import { Response, NextFunction } from "express";
import { CreatePomodoroSessionRequest, UpdatePomodoroSessionRequest } from "../model/pomodoro-session-model";

export class PomodoroSessionController {
    static async createSession(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreatePomodoroSessionRequest = req.body as CreatePomodoroSessionRequest;
            const response = await PomodoroSessionService.createSession(req.user!, request);
            res.status(201).json({
                status: 201,
                message: 'Successfully created session',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateSession(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdatePomodoroSessionRequest = req.body as UpdatePomodoroSessionRequest;
            const response = await PomodoroSessionService.updateSession(req.user!, request);
            res.status(200).json({
                status: 200,
                message: 'Successfully updated session',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }
}