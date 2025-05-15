import mongoose, { Schema, Document } from 'mongoose';
import Meeting from './meeting.interface';
const meetingSchema = new Schema<Meeting>({
    meetingId: { type: String, required: true, unique: true },
    hostId: { type: String, required: true },
    participants: [{ type: String, ref: 'RegisterUser' }], 
    startTime: { type: Date, required: true },
    endTime: { type: Date, optional: true },
    password: { type: String, optional: true }
});

const MeetingModel = mongoose.model<Meeting>('Meeting', meetingSchema);
export default MeetingModel;