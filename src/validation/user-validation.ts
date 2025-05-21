import {z, ZodType} from "zod";

export class UserValidation {
    static readonly UPDATE: ZodType = z.object({
        username: z.string().min(3).max(50).optional(),
        email: z.string().email().min(1).max(50).optional(),
        password: z.string().min(8).max(50).optional(),
    });
}