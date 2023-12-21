import { createSlice, createAction } from "@reduxjs/toolkit";
import { type SensorData } from "@services/sensors-api/types";

const ENTRY_SNAP_MS = 2000; // group every value in this interval
const MAX_ENTRIES = 20; // no more than 20 history entries

type HistoryState = Record<number, Record<string, number[]>>;

const initialState: HistoryState = {};

const name = "history";

export const push = createAction<SensorData>(`${name}/push`);

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(push, (state, { payload }) => {
      if (payload.value === null) return;

      const detachedStateCopy = JSON.parse(JSON.stringify(state)) as typeof state;

      const computedValue = Number(payload.value);
      const timestamp = Math.floor(new Date().getTime() / ENTRY_SNAP_MS) * ENTRY_SNAP_MS;

      const currEntry = detachedStateCopy[timestamp] ?? {};
      const currSeriesValue = currEntry[payload.name] ?? [];
      currSeriesValue.push(computedValue);

      currEntry[payload.name] = currSeriesValue;

      return Object.fromEntries(
        Object.entries({
          ...detachedStateCopy,
          [timestamp]: Object.fromEntries(Object.entries(currEntry).slice(MAX_ENTRIES * -1)),
        }).slice(MAX_ENTRIES * -1),
      );
    });
  },
});

export const actions = {
  ...slice.actions,
  push,
};
