import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./slices/company.slice";
import productsReducer from "./slices/product.slice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    products: productsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
