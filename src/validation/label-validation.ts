import {z,ZodType} from "zod";

export class LabelValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(3).max(20),
        color: z.string().min(7).max(7).includes('#').regex(/^#[0-9a-fA-F]{6}$/i, 'Invalid color code')
    });

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(3).max(20).optional(),
        color: z.string().min(7).max(7).includes('#').regex(/^#[0-9a-fA-F]{6}$/i, 'Invalid color code').optional()
    });
}