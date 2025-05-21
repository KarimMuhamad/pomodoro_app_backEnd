import {z, ZodType} from "zod";

export class PreferenceValidation {
    static readonly UPDATE: ZodType = z.object({
        focusDuration: z.number().positive().optional(),
        shortBreakDuration: z.number().positive().optional(),
        longBreakDuration: z.number().positive().optional(),
        autoStartFocus: z.boolean().optional(),
        autoStartBreak: z.boolean().optional(),
    });
}