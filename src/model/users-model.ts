import {User} from "@prisma/client";

export type UserResponse = {
    id: number;
    username: string;
    email: string;
}

export type UpdateUserRequest = {
    username?: string;
    email?: string;
    password?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
    }
}