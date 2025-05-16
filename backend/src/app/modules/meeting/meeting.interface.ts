import mongoose, { Schema, Document } from 'mongoose';

// interface Meeting extends Document {
//     meetingId: string;
//     hostId: string;
//     participants: string[]; 
//     startTime: Date;
//     endTime?: Date;
//     password?: string; 
// }


interface ChatMessage {
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  replyTo?: string;
}

interface Meeting extends Document {
  meetingId: string;
  hostId: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  password?: string;
  messages?: ChatMessage[];
}
export default Meeting;