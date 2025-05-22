import { LabelService } from "../service/label-service";
import {AuthUserRequest} from "../type/auth-typeToken";
import {Response, NextFunction} from "express";
import {CreateLabelRequest, UpdateLabelRequest} from "../model/label-model";

export class LabelController {
    static async getLabels(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const response = await LabelService.getLabels(req.user!);
            res.status(200).json({
                status: 200,
                message: 'SuccessFully get labels',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async getLabelById(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.labelId);
            const response = await LabelService.getLabelById(req.user!, id);
            res.status(200).json({
                status: 200,
                message: 'SuccessFully get label',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async createLabel(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateLabelRequest = req.body as CreateLabelRequest;
            const response = await LabelService.createLabel(req.user!, request);
            res.status(201).json({
                status: 201,
                message: 'SuccessFully create label',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateLabel(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.labelId);
            const request: UpdateLabelRequest = req.body as UpdateLabelRequest;
            const response = await LabelService.updateLabel(req.user!, request, id);
            res.status(200).json({
                status: 200,
                message: 'Successfully update label',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async deleteLabel(req: AuthUserRequest, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.labelId);
            const response = await LabelService.deleteLabel(req.user!, id);
            res.status(200).json({
                status: 200,
                message: 'Successfully delete label',
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }
}