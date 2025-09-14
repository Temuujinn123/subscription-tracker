import { createApi } from "@reduxjs/toolkit/query/react";
import { errorHandlerMiddleware } from "./middleware/errorHandleMiddleware";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: errorHandlerMiddleware,
  endpoints: (build) => ({
    createSub: build.mutation<Subscription, RequestSub>({
      query: ({ name, price, billingCycle, nextBillingDate, category }) => ({
        url: "subscriptions",
        method: "POST",
        body: {
          name,
          price,
          billingCycle,
          nextBillingDate,
          category,
        },
      }),
    }),
  }),
});

export const { useCreateSubMutation } = subscriptionApi;
