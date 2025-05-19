import {User} from "@prisma/client";

export type AuthResponse = {
    id: number;
    username: string;
    email: string;
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
    }
}