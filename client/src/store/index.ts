import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import * as sensors from "./modules/sensors";
import * as history from "./modules/history";

export const rootReducer = combineReducers({
  sensors: sensors.slice.reducer,
  history: history.slice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    whitelist: ["history"],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
});

type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

const useAppDispatch: () => AppDispatch = useDispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const Store = {
  store,
  persistor: persistStore(store),
  useDispatch: useAppDispatch,
  useSelector: useAppSelector,
  actions: {
    sensors: {
      ...sensors.slice.actions,
      ...sensors.asyncThunks,
    },
    history: history.actions,
  },
};
