import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  replyTo?: string;
}

interface MeetingState {
  participants: { userId: string; userName: string }[];
  messages: Message[];
}

const initialState: MeetingState = {
  participants: [],
  messages: [],
};

export const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    addParticipant: (state, action: PayloadAction<{ userId: string; userName: string }>) => {
      state.participants.push(action.payload);
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(p => p._id !== action.payload);
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    resetMeeting: () => initialState,
  },
});

export const { addParticipant, removeParticipant, addMessage, resetMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
