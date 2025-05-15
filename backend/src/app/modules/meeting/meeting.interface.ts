import mongoose, { Schema, Document } from 'mongoose';

interface Meeting extends Document {
    meetingId: string;
    hostId: string;
    participants: string[]; 
    startTime: Date;
    endTime?: Date;
    password?: string; 
}
export default Meeting;