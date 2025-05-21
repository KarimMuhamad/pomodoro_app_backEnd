import {AuthUserRequest} from "../type/auth-typeToken";
import {Response, NextFunction} from "express";
import {PreferencesService} from "../service/preferences-service";
import {UpdatePreferencesRequest} from "../model/preferences-model";

export class PreferencesController {
    static async getPreferences(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const response = await PreferencesService.getPreferences(req.user!);
            res.status(200).json({
                status: 200,
                message: 'SuccessFully get preferences',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    };

    static async updatePreferences(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdatePreferencesRequest = req.body as UpdatePreferencesRequest;
            const response = await PreferencesService.updatePreferences(req.user!, request);
            res.status(200).json({
                status: 200,
                message: 'SuccessFully update preferences',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    };
}