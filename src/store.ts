import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./redux/reducers";

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import React from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type InferArgs<T> = T extends (...t: [...infer Arg]) => any ? Arg : never;
type InferReturn<T> = T extends (...t: [...infer Arg]) => infer Res
  ? Res
  : never;

export const useAction = <TFunc extends (...args: any[]) => any>(
  action: TFunc
): ((...args: InferArgs<TFunc>) => InferReturn<TFunc>) => {
  const dispatch = useAppDispatch();

  return React.useMemo(
    () =>
      (...args: InferArgs<TFunc>) =>
        dispatch(action(...args)),
    [action, dispatch]
  );
};

export default store;
