import { Request, Response } from 'express';
import { createMeeting, joinMeeting } from './meeting.service';
import { socketVerifyToken as verifyToken } from '../../utils/socketVerifyToken';
/**
 * Creates a new meeting.
 * @param req The request object.
 * @param res The response object.
 */

export const createMeetingController = async (req: Request, res: Response): Promise<void> => { //Added Promise<void>
    try {
        const { startTime, password } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const decoded = verifyToken(token);
        const hostId = decoded._id;

        const meetingId = await createMeeting(hostId, startTime, password);
        res.status(201).json({ meetingId, message: 'Meeting created successfully' });
    } catch (error: any) {
        console.error("Create Meeting Error:", error);
        res.status(500).json({ message: 'Failed to create meeting', error: error.message });
    }
};

/**
 * Joins an existing meeting.
 * @param req The request object.
 * @param res The response object.
 */
export const joinMeetingController = async (req: Request, res: Response): Promise<void> => { //Added Promise<void>
    try {
        const { meetingId, password } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const decoded = verifyToken(token);
        const userId = decoded._id;

        const result = await joinMeeting(userId, meetingId, password);
        if (typeof result === 'string') { // Check for error message
            res.status(400).json({ message: result }); // Or appropriate status code
            return;
        }

        res.status(200).json({ meetingId, message: 'Joined meeting successfully' });
    } catch (error: any) {
        console.error("Join Meeting Error:", error);
        res.status(500).json({ message: 'Failed to join meeting', error: error.message });
    }
};
