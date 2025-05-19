import {User} from "@prisma/client";

export type AuthResponse = {
    id: number;
    username: string;
    email: string;
    token?: string;
    expires?: number;
}

export type RegisterAuthRequest = {
    username: string;
    email: string;
    password: string;
}

export type LoginAuthRequest = {
    username?: string;
    email?: string;
    password: string;
}

export function toAuthResponse(User: User, token?: string, expires?: number): AuthResponse {
    return {
        id: User.id,
        username: User.username,
        email: User.email,
        token: token,
        expires: expires,
    }
}