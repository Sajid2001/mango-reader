// store.js
import { configureStore } from '@reduxjs/toolkit';
import managReducer from "./mangaSlice";

export const store = configureStore({
    reducer: {
        manga: managReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;