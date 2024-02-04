import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/directus";
import { v4 as uuid } from "uuid";
import { AxiosError } from "axios";
import { Components, DirectusResponse } from "../../types/directus";

export const fetchStops = createAsyncThunk(
  "stop_view/fetchStops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        DirectusResponse<Components.Schemas.ItemsStops[]>
      >("/items/stops", {
        params: {
          filter: {
            _or: [
              {
                reporter: {
                  id: {
                    _eq: "$CURRENT_USER",
                  },
                },
              },
              {
                active: {
                  _eq: true,
                },
              },
            ],
          },
          fields: ["id", "stop_name", "active", "location"],
        },
      });
      return response.data.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        rejectWithValue(err.response?.data);
      }
    }
  }
);

export const manageStop = createAsyncThunk(
  "stop_view/manageStop",
  async (stop: Components.Schemas.ItemsStops, { rejectWithValue }) => {
    try {
      if (stop.id) {
        // id exists, so patch instead of post
        const response = await api.patch<
          DirectusResponse<Components.Schemas.ItemsStops>
        >(`/items/stops/${stop.id}`, stop);
        return response.data.data;
      }

      const newStop = {
        ...stop,
        id: uuid(),
      };

      await api.post("/items/stops", newStop);

      // we don't return response.data
      // because the api sends 204 no content
      return newStop;
    } catch (err) {
      if (err instanceof AxiosError) {
        rejectWithValue(err.response?.data);
      }
    }
  }
);

export interface State {
  stops: Record<string, Components.Schemas.ItemsStops>;
  loading: boolean;
  error: string | null;
}

const slice = createSlice({
  name: "stop_view",
  initialState: {
    stops: {},
    loading: false,
    error: null,
  } as State,
  extraReducers: (builder) => {
    builder.addCase(fetchStops.pending, (state, _) => {
      state.loading = true;
    });

    builder.addCase(fetchStops.fulfilled, (state, action) => {
      state.loading = false;

      if (!action.payload) {
        return;
      }

      state.stops = action.payload.reduce((arr, s) => {
        arr[s.id!] = s;
        return arr;
      }, {} as Record<string, Components.Schemas.ItemsStops>);
    });

    builder.addCase(fetchStops.rejected, (state) => {
      state.loading = false;
      state.error = "could not fetch stops";
    });

    builder.addCase(manageStop.pending, (state, _) => {
      state.loading = true;
    });

    builder.addCase(manageStop.fulfilled, (state, action) => {
      const stop = action.payload!;
      state.loading = false;
      state.stops[stop!.id!] = stop;
    });

    builder.addCase(manageStop.rejected, (state, action) => {
      state.loading = false;
      state.error = "could not manage stops";
    });
  },
  reducers: {},
});

export default slice.reducer;
