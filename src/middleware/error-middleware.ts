import {Request, Response, NextFunction} from "express";
import {ZodError} from "zod";
import {ResponseError} from "../error/response-error";
import {JsonWebTokenError} from "jsonwebtoken";

export const errorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            status: 400,
            error: `Validation Error: ${JSON.stringify(err.errors)}`,
        });
    } else if (err instanceof ResponseError) {
        res.status(err.status).json({
            status: err.status,
            error: err.message,
        });
    } else if (err instanceof JsonWebTokenError) {
        res.status(401).json({
            status: 401,
            error: err.message,
        });
    } else {
        res.status(500).json({
            status: 500,
            error: err.message,
        })
    }
};