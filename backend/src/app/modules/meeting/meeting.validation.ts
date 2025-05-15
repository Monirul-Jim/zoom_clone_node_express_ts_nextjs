import { z } from 'zod';

// Schema for creating a meeting
export const createMeetingSchema = z.object({
    body: z.object({
        startTime: z.coerce.date(),
        password: z.string().optional(),
    })
});

// Schema for joining a meeting
export const joinMeetingSchema = z.object({
    body: z.object({
        meetingId: z.string().min(1),
        password: z.string().optional(),
    })
});