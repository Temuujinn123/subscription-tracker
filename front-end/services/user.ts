import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (build) => ({
    register: build.mutation<
      AuthResult,
      { name: string; email: string; password: string }
    >({
      query: ({ name, email, password }) => ({
        url: "register",
        method: "POST",
        body: {
          name,
          email,
          password,
        },
      }),
    }),
    login: build.mutation<AuthResult, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    authGoogle: build.mutation<AuthResult, string>({
      query: (code) => ({
        url: "auth/google",
        method: "POST",
        body: {
          code,
        },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useAuthGoogleMutation } =
  userApi;
