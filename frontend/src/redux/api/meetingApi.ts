import { baseApi } from "./baseApi";

const meetingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMeeting: builder.mutation({
      query: (body) => ({
        url: "/meeting",
        method: "POST",
        body,
      }),
    }),
    meetingJoin: builder.mutation({
      query: (credentials) => ({
        url: "/meeting/join",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
export const { useCreateMeetingMutation, useMeetingJoinMutation } = meetingApi;