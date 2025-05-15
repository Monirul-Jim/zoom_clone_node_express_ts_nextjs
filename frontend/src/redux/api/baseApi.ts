// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:5000/api/v1",

//     credentials: "include",
//   }),
//   endpoints: () => ({}),
// });

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '../store';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  // in meetingApi.ts or baseApi.ts
baseQuery: fetchBaseQuery({
  // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
   baseUrl: "http://localhost:5000/api/v1",
   credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token; // or from localStorage/cookie

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
}),

  // baseQuery: fetchBaseQuery({
  //     baseUrl: "http://localhost:5000/api/v1",
  //   credentials: 'include',
  //   prepareHeaders: (headers, {getState}) => {
  //     const token = (getState() as RootState).auth.token;
  //     if (token) {
  //       headers.set('authorization', `${token}`);
  //     }
  //     return headers;
  //   },
  // }),
  endpoints: () => ({}),
});