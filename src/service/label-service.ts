import {CreateLabelRequest, LabelResponse, toLabelResponse} from "../model/label-model";
import {User} from "@prisma/client";
import prisma from "../application/database";
import {LabelValidation} from "../validation/label-validation";
import {Validation} from "../validation/validation";

export class LabelService {
    static async getLabels(user: User): Promise<LabelResponse[]> {
        const labels = await prisma.label.findMany({
            where: {
                userId: user.id
            }
        });

        return labels;
    }

    static async getLabelById(user: User, id: number): Promise<LabelResponse> {
        const label = await prisma.label.findUnique({
            where: {
                id: id,
            }
        });

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
}