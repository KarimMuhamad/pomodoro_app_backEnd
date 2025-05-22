import {User, UserPreferences} from "@prisma/client";
import {PreferencesResponse, toPreferencesResponse} from "./preferences-model";

export type UserResponse = {
    id: number;
    username: string;
    email: string;
}

export type UserSettingsResponse = {
    user: UserResponse;
    preferences: PreferencesResponse;
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

export function toUserSettingsResponse(user: User, preferences: UserPreferences): UserSettingsResponse {
    return {
        user: toUserResponse(user),
        preferences: toPreferencesResponse(preferences),
    }
}