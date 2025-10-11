import { createApi } from "@reduxjs/toolkit/query/react";
import { errorHandlerMiddleware } from "./middleware/errorHandleMiddleware";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: errorHandlerMiddleware,
  tagTypes: ["sub"],
  endpoints: (build) => ({
    getSubs: build.query<Subscription[], void>({
      query: () => ({
        url: "subscriptions",
      }),
      providesTags: ["sub"],
    }),
    getSubDetail: build.query<Subscription, number>({
      query: (id) => ({
        url: `subscriptions/${id}`,
      }),
      providesTags: ["sub"],
    }),
    createSub: build.mutation<Subscription, RequestSub>({
      query: (requestSub) => ({
        url: "subscriptions",
        method: "POST",
        body: requestSub,
      }),
      invalidatesTags: ["sub"],
    }),
    updateSub: build.mutation<Subscription, { id: number; body: RequestSub }>({
      query: (requestSub) => ({
        url: `subscriptions/${requestSub.id}`,
        method: "PUT",
        body: requestSub.body,
      }),
      invalidatesTags: ["sub"],
    }),
    deleteSub: build.mutation<void, number>({
      query: (id) => ({
        url: `subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sub"],
    }),
    getSubStats: build.query<SubStats, void>({
      query: () => ({
        url: "subscriptions/stats",
      }),
      providesTags: ["sub"],
    }),
  }),
});

export const {
  useGetSubsQuery,
  useGetSubDetailQuery,
  useCreateSubMutation,
  useUpdateSubMutation,
  useDeleteSubMutation,
  useGetSubStatsQuery,
} = subscriptionApi;
