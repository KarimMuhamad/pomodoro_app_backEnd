import {AuthResponse} from "../model/auth-model";

export interface AuthTypeToken {
    authRes: AuthResponse;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    refreshTokenExpires: number;
}