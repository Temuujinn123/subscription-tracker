import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { RootState } from "../store";
import { userApi } from "../user";
import { setAuthData } from "../authSlice";

export const errorHandlerMiddleware: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const { token } = state.auth;

      headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  })(args, api, extraOptions);

  if (result.error) {
    const { data } = result.error;

    switch (result.meta?.response?.status) {
      case 401:
        console.log(api.endpoint);
        if (api.endpoint === "getAccessToken") {
          if (
            !window.location.pathname.includes("/subscriptions") &&
            !window.location.pathname.includes("/dashboard")
          )
            break;

          window.location.href = "/login";

          break;
        }

        const response = await api.dispatch(
          userApi.endpoints.getAccessToken.initiate(),
        );

        const accessToken = response?.data?.token;

        if (accessToken) {
          api.dispatch(setAuthData({ token: accessToken }));

          const response = await fetchBaseQuery({
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
            prepareHeaders: (headers, { getState }) => {
              const state = getState() as RootState;
              const { token } = state.auth;

              headers.set("authorization", `Bearer ${token}`);

              return headers;
            },
          })(args, api, extraOptions);

          console.log(response);

          return response;
        }

        if (
          !window.location.pathname.includes("/subscriptions") &&
          !window.location.pathname.includes("/dashboard")
        )
          break;

        window.location.href = "/login";
        localStorage.removeItem("token");

        break;
      case 404:
        console.error("Resource not found");
        break;
      case 500:
        console.error("Server error");
        break;
      default:
        console.error("Unknown error:", data);
    }
  }

  return result;
};
