import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  createAction,
  type PayloadAction,
} from "@reduxjs/toolkit";
import * as API from "@services/sensors-api/index";
import { type SensorData } from "@services/sensors-api/types";
import * as history from "./history";

export type SensorStateItem = SensorData;

interface SensorsState {
  data: Record<SensorStateItem["id"], SensorStateItem> | undefined;
  loading: number;
  error: string | undefined;
  serverConnected: boolean;
}

const initialState: SensorsState = {
  data: undefined,
  loading: 0,
  error: undefined,
  serverConnected: false,
};

const name = "sensors";

const connectServer = createAsyncThunk<Partial<SensorsState>>(
  `${name}/connectServer`,
  async (_, { dispatch }) => {
    let error: SensorsState["error"];
    let serverConnected: SensorsState["serverConnected"] = false;

    try {
      await API.connectServer({
        onSensorData: (data) => {
          dispatch(updateSensor(data));
          dispatch(history.push(data));
        },
      });

      serverConnected = true;
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : String(e);
    }

    return {
      error,
      serverConnected,
    };
  },
);

const updateSensor = createAction<SensorData>(`${name}/updateSensor`);

export const asyncThunks = {
  connectServer,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    reset: () => initialState,
    connectSensor: (state, action: PayloadAction<SensorData["id"]>) => {
      let error: string | undefined;

      try {
        API.connectSensor(action.payload);
      } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
      }

      return {
        ...state,
        error,
      };
    },
    disconnectSensor: (state, action: PayloadAction<SensorData["id"]>) => {
      let error: string | undefined;

      try {
        API.disconnectSensor(action.payload);
      } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
      }

      return {
        ...state,
        error,
      };
    },
    disconnectServer: (state) => {
      let error: string | undefined;

      try {
        API.disconnectServer();
      } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
      }

      return {
        ...state,
        error,
        serverConnected: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateSensor, (state, { payload }) => {
      state.data = state.data ?? {};
      state.data[payload.id] = {
        ...payload,
        value: typeof payload.value === "string" ? String(Number(payload.value).toFixed(1)) : null,
      };
    });

    builder.addCase(connectServer.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));

    Object.values(asyncThunks).forEach((t) => {
      builder.addCase(t.rejected, (state, action) => {
        state.error = action.error.message;
      });
    });

    Object.values(asyncThunks).forEach((t) => {
      builder.addMatcher(isAnyOf(t.pending), (state) => {
        state.error = undefined;
        state.loading += 1;
      });

      builder.addMatcher(isAnyOf(t.rejected, t.fulfilled), (state) => {
        state.loading -= 1;
      });
    });
  },
});
