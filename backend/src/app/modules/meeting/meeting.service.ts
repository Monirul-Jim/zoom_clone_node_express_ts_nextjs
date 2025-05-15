import { v4 as uuidv4 } from 'uuid';
import MeetingModel from './meeting.model';

export const createMeeting = async (hostId: string, startTime: Date, password?: string) => {
    const meetingId = uuidv4();
    const newMeeting = new MeetingModel({
        meetingId,
        hostId,
        startTime,
        participants: [hostId], 
        password
    });
    await newMeeting.save();
    return meetingId;
};

export const joinMeeting = async (userId: string, meetingId: string, password?: string) => {
  const meeting = await MeetingModel.findOne({ meetingId });
    if (!meeting) {
        return 'Meeting not found';
    }

    if (meeting.password && meeting.password !== password) {
        return 'Incorrect password';
    }

    if (meeting.participants.length >= 15) {
        return 'Meeting is full';
    }

    if (!meeting.participants.includes(userId)) {
        meeting.participants.push(userId); 
        await meeting.save(); 
    }
};