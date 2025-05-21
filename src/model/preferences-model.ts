import {UserPreferences} from "@prisma/client";

export type PreferencesResponse = {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    autoStartFocus: boolean;
    autoStartBreak: boolean;
}

export type UpdatePreferencesRequest = {
    focusDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
    autoStartFocus?: boolean;
    autoStartBreak?: boolean;
}

export function toPreferencesResponse(preferences: UserPreferences): PreferencesResponse {
    return {
        focusDuration: preferences.focusDuration,
        shortBreakDuration: preferences.shortBreakDuration,
        longBreakDuration: preferences.longBreakDuration,
        autoStartFocus: preferences.autoStartFocus,
        autoStartBreak: preferences.autoStartBreak,
    }
}