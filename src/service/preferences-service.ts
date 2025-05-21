import prisma from "../application/database";
import { ResponseError } from "../error/response-error";
import {PreferencesResponse, toPreferencesResponse, UpdatePreferencesRequest} from "../model/preferences-model";
import {User} from "@prisma/client";
import { Validation } from "../validation/validation";
import {PreferenceValidation} from "../validation/preference-validation";

export class PreferencesService {
    static async getPreferences(user: User) : Promise<PreferencesResponse> {
        const preferences = await prisma.userPreferences.findUnique({
            where: {
                userId: user.id
            }
        });

        return toPreferencesResponse(preferences!);
    };

    static async updatePreferences(user: User, req: UpdatePreferencesRequest) : Promise<PreferencesResponse> {
        const validateUpdate = Validation.validate(PreferenceValidation.UPDATE, req);

        const preferences = await prisma.userPreferences.update({
            where: {
                userId: user.id
            },
            data: validateUpdate
        });

        return toPreferencesResponse(preferences!);
    }
}