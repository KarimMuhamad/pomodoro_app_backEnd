import {CreateLabelRequest, LabelResponse, toLabelResponse, UpdateLabelRequest} from "../model/label-model";
import {User} from "@prisma/client";
import prisma from "../application/database";
import {LabelValidation} from "../validation/label-validation";
import {Validation} from "../validation/validation";
import {ResponseError} from "../error/response-error";

export class LabelService {
    static async getLabels(user: User): Promise<LabelResponse[]> {
        const labels = await prisma.label.findMany({
            where: {
                userId: user.id
            }
        });

        return labels;
    }

    static async findLabelById  (user: User, id: number)  {
        const label = await prisma.label.findUnique({
            where: {
                id: id,
                userId: user.id
            }
        });

        if (!label) {
            throw new ResponseError(404, 'No label found.');
        }

        return label;
    }

    static async getLabelById(user: User, id: number): Promise<LabelResponse> {
        const label = await this.findLabelById(user, id);

        return toLabelResponse(label!);
    }

    static async createLabel(user: User, req: CreateLabelRequest) : Promise<LabelResponse> {
        const validateCreate = Validation.validate(LabelValidation.CREATE, req);

        const record = {
            ...validateCreate,
            ...{userId: user.id}
        }

        const label = await prisma.label.create({
            data: record
        });

        return toLabelResponse(label);
    }

    static async updateLabel(user: User, req: UpdateLabelRequest, id: number): Promise<LabelResponse> {
        const label = await this.findLabelById(user, id);

        const validateUpdate = Validation.validate(LabelValidation.UPDATE, req);

        if (validateUpdate.name) {
            req.name = validateUpdate.name;
        }

        if (validateUpdate.color) {
            req.color = validateUpdate.color;
        }

        const result = await prisma.label.update({
            where: {
                id: label.id,
            },
            data: validateUpdate
        });



        return toLabelResponse(result);
    }

    static async deleteLabel(user: User, id: number): Promise<LabelResponse> {
        const label = await this.findLabelById(user, id);

        if (label.isDefault) {
            throw new ResponseError(403, 'Forbidden');
        }

        const result = await prisma.label.delete({
            where: {
                id: label.id,
            }
        });

        return toLabelResponse(result);
    }
}