import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "@/services/user";
import { subscriptionApi } from "./subsciption";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(subscriptionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
