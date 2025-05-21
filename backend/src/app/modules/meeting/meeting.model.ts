import mongoose, { Schema, Document } from 'mongoose';
import Meeting from './meeting.interface';

const meetingSchema = new Schema<Meeting>({
  meetingId: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  participants: [{ type: String, ref: 'RegisterUser' }],
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  password: { type: String },
  messages: [
    {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      replyTo: { type: String },
    }
  ]
});

const MeetingModel = mongoose.model<Meeting>('Meeting', meetingSchema);
export default MeetingModel;