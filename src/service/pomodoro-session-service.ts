import { CreatePomodoroSessionRequest, PomodoroSessionResponse, toPomodoroSessionResponse, UpdatePomodoroSessionRequest } from "../model/pomodoro-session-model";
import { User } from "@prisma/client";
import prisma from "../application/database";
import { PomodoroSessionValidation } from "../validation/pomodoro-session-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { LabelService } from "./label-service";

export class PomodoroSessionService {
    static async createSession(user: User, req: CreatePomodoroSessionRequest): Promise<PomodoroSessionResponse> {
        const validateCreate = Validation.validate(PomodoroSessionValidation.CREATE, req);

        if (!validateCreate.labelId) {
            validateCreate.labelId = await LabelService.getDefaultLabel(user).then(label => label.id);
        }
        
        await LabelService.findLabelById(user, validateCreate.labelId!);
        
        const record = {
            ...validateCreate,
            userId: user.id,
            isCompleted: false
        };
        
        const session = await prisma.pomodoroSession.create({
            data: record
        });
        
        return toPomodoroSessionResponse(session);
    }
    
    static async findSessionById(user: User, id: number) {
        const session = await prisma.pomodoroSession.findFirst({
            where: {
                id: id,
                userId: user.id
            }
        });
        
        if (!session) {
            throw new ResponseError(404, 'No session found.');
        }
        
        return session;
    }

    static async getSessionById(user: User, id: number) {
        const res = await this.findSessionById(user ,id);

        return toPomodoroSessionResponse(res);
    }
    
    static async updateSession(user: User, req: UpdatePomodoroSessionRequest, id: number): Promise<PomodoroSessionResponse> {
        const session = await this.findSessionById(user, id);
        
        const validateUpdate = Validation.validate(PomodoroSessionValidation.UPDATE, req);
        
        const result = await prisma.pomodoroSession.update({
            where: {
                id: session.id,
            },
            data: validateUpdate
        });
        
        return toPomodoroSessionResponse(result);
    }
}