// lib/store/middleware/errorHandlerMiddleware.ts
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { Router } from "next/router";

// Store router instance (you can pass this from your app)
let router: Router | null = null;

export const setRouter = (nextRouter: Router) => {
  router = nextRouter;
};

export const errorHandlerMiddleware: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  })(args, api, extraOptions);

  if (result.error) {
    const { data } = result.error;

    switch (result.meta?.response?.status) {
      case 401:
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
