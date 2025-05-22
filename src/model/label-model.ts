import {Label} from "@prisma/client";

export type LabelResponse = {
    id: number;
    name: string;
    color: string;
}

export type CreateLabelRequest = {
    name: string;
    color: string;
}

export type UpdateLabelRequest = {
    name?: string;
    color?: string;
}

export function toLabelResponse(label: Label): LabelResponse {
    return {
        id: label.id,
        name: label.name,
        color: label.color,
    }
}