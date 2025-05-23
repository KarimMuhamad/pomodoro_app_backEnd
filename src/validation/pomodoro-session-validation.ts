import { z, ZodType } from "zod";
import { SessionType } from "@prisma/client";

export class PomodoroSessionValidation {
    static readonly CREATE: ZodType = z.object({
        labelId: z.number().int().min(0).optional(),
        duration: z.number().int().min(0),
        hour: z.number().int().min(0).max(23),
        type: z.nativeEnum(SessionType)
    });

    static readonly UPDATE: ZodType = z.object({
        duration: z.number().int().min(0),
        isCompleted: z.boolean().optional()
    });
}