import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import legacyApi from "../../services/backend";
import api from "../../services/directus";
import { AxiosError } from "axios";
import { Components, DirectusResponse } from "../../types/directus";

export type ticketEditInput = {
  id: string;
  approved?: boolean;
  deny_reason?: string;
};

export const ticketEdit = createAsyncThunk(
  "trip/ticketEdit",
  async ({ id, ...rest }: ticketEditInput, { rejectWithValue }) => {
    try {
      const resp = await api.patch<
        DirectusResponse<Components.Schemas.ItemsTickets>
      >(`/items/tickets/${id}`, rest);
      return resp.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        rejectWithValue(err.response?.data);
      }
    }
  }
);

export const fetchTrips = createAsyncThunk(
  "trip/fetchTrips",
  async (_, { rejectWithValue }) => {
    try {
      // graphql query
      // const response = await GraphQL.query({
      //   query: tripsQuery,
      // });

      // we have to not use graphql for now
      // because it can't handle postgres intervals yet
      const response = await api.get<
        DirectusResponse<Components.Schemas.ItemsTrips[]>
      >("/items/trips", {
        params: {
          filter: {
            owner: "$CURRENT_USER",
          },
          fields: [
            "*",
            "calendar.*",
            "stop_times.*",
            "stop_times.stop.stop_name",
            "stop_times.stop.id",
            "route.*",
            "trip_updates.*",
            "tickets.id",
            "tickets.origin_stop_sequence",
            "tickets.destination_stop_sequence",
            "tickets.start_date",
            "tickets.approved",
            "tickets.owner.display_name",
          ],
        },
      });
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        rejectWithValue(err.response?.data);
      }
    }
  }
);

export const cancelTrip = createAsyncThunk<
  string | undefined,
  string,
  { rejectValue: any }
>("trip/cancelTrip", async (tripId, { rejectWithValue }) => {
  try {
    await legacyApi.delete(`/trips/${tripId}`);
    return tripId;
  } catch (err) {
    if (err instanceof AxiosError) {
      rejectWithValue(err.response?.data);
    }
  }
});

export interface State {
  trips: { [index: string]: Components.Schemas.ItemsTrips };
  loading: boolean;
  tripLoading: string | null;
  error: string | null;
}

const slice = createSlice({
  name: "trip",
  initialState: {
    trips: {},
    loading: false,
    tripLoading: null, // loading indicator for specific trip
    error: null,
  } as State,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTrips.pending, (state, _) => {
      state.loading = true;
    });

    builder.addCase(fetchTrips.fulfilled, (state, action) => {
      state.loading = false;
      if (!action.payload) {
        return;
      }

      const response = action.payload.data!;

      state.trips = response.reduce((trips: { [index: string]: any }, trip) => {
        trips[trip.id!] = trip;
        return trips;
      }, {});
    });

    builder.addCase(fetchTrips.rejected, (state, action) => {
      state.loading = false;
      state.error = "fetch trip failed";
    });

    builder.addCase(cancelTrip.pending, (state, action) => {
      state.loading = true;
      state.tripLoading = action.meta.arg;
    });

    builder.addCase(cancelTrip.fulfilled, (state, { payload: tripId }) => {
      // state.trips[tripId!].schedule_relationship = "CANCELED";
      state.loading = false;
      state.tripLoading = null;
    });

    builder.addCase(cancelTrip.rejected, (state, action) => {
      state.loading = false;
      state.tripLoading = null;
      state.error = action.payload;
    });

    builder.addCase(ticketEdit.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(ticketEdit.fulfilled, (state, { payload }) => {
      state.loading = false;
      const { trip: tripId, id } = payload!.data!;
      const trip = tripId as string;

      const ticketToReplace = state.trips[trip]?.tickets?.findIndex(
        (t) => t.id === id
      );

      if (ticketToReplace === undefined) {
        return;
      }

      state.trips[trip].tickets![ticketToReplace] = payload!.data;
    });

    builder.addCase(ticketEdit.rejected, (state) => {
      state.error = "ticket.edit.failes";
    });
  },
});

export default slice.reducer;
