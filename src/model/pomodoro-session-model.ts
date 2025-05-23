import { PomodoroSession, SessionType } from "@prisma/client";

export type PomodoroSessionResponse = {
    id: number;
    userId: number;
    labelId: number;
    duration: number;
    startTime: Date;
    endTime?: Date;
    hour: number;
    type: SessionType;
    isCompleted: boolean;
}

export type CreatePomodoroSessionRequest = {
    labelId: number;
    duration: number;
    hour: number;
    type: SessionType;
}

export type UpdatePomodoroSessionRequest = {
    duration: number;
    isCompleted?: boolean;
}

export function toPomodoroSessionResponse(session: PomodoroSession): PomodoroSessionResponse {
    return {
        id: session.id,
        userId: session.userId,
        labelId: session.labelId,
        duration: session.duration,
        startTime: session.startTime,
        endTime: session.endTime || undefined,
        hour: session.hour,
        type: session.type,
        isCompleted: session.isCompleted
    }
}