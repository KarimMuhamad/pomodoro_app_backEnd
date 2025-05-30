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

    static async getDefaultLabel(user: User) {
        const label = await prisma.label.findFirst({
            where: {
                userId: user.id,
                isDefault: true
            }
        });

        if (!label) {
            throw new ResponseError(404, 'Default label not found');
        }

        return label;
    }

    static async deleteLabel(user: User, id: number): Promise<LabelResponse> {
        const labelToDelete = await prisma.label.findUnique({
            where: {
                id: id,
                userId: user.id
            },
            include: {PomodoroSession: true}
        });

        if (!labelToDelete || labelToDelete.userId !== user.id) {
            throw new ResponseError(404, 'No label found or Unauthorized');
        }

        if (labelToDelete.isDefault) {
            throw new ResponseError(403, 'Forbidden');
        }

        const defaultLabel = await this.getDefaultLabel(user);

        let result;

        await prisma.$transaction(async (tx) => {
            if (labelToDelete.PomodoroSession.length > 0) {
                await tx.pomodoroSession.updateMany({
                    where: {labelId: id},
                    data: {labelId: defaultLabel.id}
                });
            }

            result = await tx.label.delete({
                where: {
                    id: id,
                    userId: user.id
                }
            });
        });



        return toLabelResponse(result!);
    }
}