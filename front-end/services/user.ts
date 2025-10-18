import { createApi } from "@reduxjs/toolkit/query/react";
import { errorHandlerMiddleware } from "./middleware/errorHandleMiddleware";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: errorHandlerMiddleware,
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
        credentials: "include",
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
        credentials: "include",
      }),
    }),
    authGoogle: build.mutation<AuthResult, string>({
      query: (code) => ({
        url: "auth/google",
        method: "POST",
        body: {
          code,
        },
        credentials: "include",
      }),
    }),
    getUserDetail: build.query<User, void>({
      query: () => ({
        url: "detail",
      }),
    }),
    getAccessToken: build.query<RefreshResult, void>({
      query: () => ({
        url: "refresh",
        method: "POST",
        credentials: "include",
      }),
    }),
    logOut: build.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useAuthGoogleMutation,
  useGetUserDetailQuery,
  useGetAccessTokenQuery,
  useLogOutMutation,
} = userApi;
