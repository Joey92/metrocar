import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../services/directus";
import { Components, Error, Paths } from "../../types/directus";

export const fetchTripData = createAsyncThunk<
  Paths.ReadSingleItemsTrips.Responses.$200,
  string,
  {
    rejectValue: AxiosError<Error>;
  }
>("driver/trip", async (id, { rejectWithValue }) =>
  api
    .get<Paths.ReadSingleItemsTrips.Responses.$200>(`/items/trips/${id}`, {
      params: {
        fields: [
          "id",
          "start_date",
          "route.short_name",
          "route.route_color",
          "route.route_text_color",
          "stop_times.arrival",
          "stop_times.departure",
          "stop_times.stop_sequence",
          "stop_times.stop.id",
          "stop_times.stop.stop_name",
          "stop_times.stop.location",
          "stop_times.stop.tts_stop_name",
          "trip_updates.*",
        ],
      },
    })
    .then((resp) => resp.data)
    .catch((resp: AxiosError<Error>) => rejectWithValue(resp))
);

export const updateTrip = createAsyncThunk<
  Paths.ReadSingleItemsRtTripUpdates.Responses.$200,
  Components.Schemas.ItemsRtTripUpdates,
  {
    rejectValue: AxiosError<Error>;
  }
>("driver/update_trip", async ({ id, ...data }, { rejectWithValue }) =>
  api
    .patch<Paths.UpdateSingleItemsRtTripUpdates.Responses.$200>(
      `/items/rt_trip_updates/${id}`,
      data
    )
    .then((resp) => resp.data)
    .catch((err: AxiosError<Error>) => rejectWithValue(err))
);

interface State {
  stop_times: Components.Schemas.ItemsStopTimes[];
  start_date: string | null;
  stopSequence: number;
  trip_updates: Components.Schemas.ItemsRtTripUpdates[];
  nextStop?: Components.Schemas.ItemsStopTimes;
  location?: GeolocationPosition;
  distanceToNextStop?: number;
  distanceToNextStopFormatted?: string;
  nextStopDisplayMode: "INCOMING_AT" | "STOPPED_AT" | "IN_TRANSIT_TO";
}

interface Coordinates {
  latitude: number;
  longitude: number;
}
/**
 * Calculates the distance (in kms) between point A and B using earth's radius as the spherical surface
 * @param pointA Coordinates from Point A
 * @param pointB Coordinates from Point B
 * Based on https://www.movable-type.co.uk/scripts/latlong.html
 */
function haversineDistance(pointA: Coordinates, pointB: Coordinates): number {
  var radius = 6371; // km

  //convert latitude and longitude to radians
  const deltaLatitude = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
  const deltaLongitude =
    ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

  const halfChordLength =
    Math.cos((pointA.latitude * Math.PI) / 180) *
      Math.cos((pointB.latitude * Math.PI) / 180) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2) +
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2);

  const angularDistance =
    2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  return radius * angularDistance;
}

const slice = createSlice({
  name: "driver",
  initialState: {
    stop_times: [],
    location: undefined,
    stopSequence: 0,
    trip_updates: [],
    start_date: null,
    nextStopDisplayMode: "IN_TRANSIT_TO",
  } as State,

  reducers: {
    setStopSequence(state, action) {
      const sequence = action.payload;
      if (sequence > state.stop_times.length - 1 || sequence < 0) {
        return;
      }

      state.stopSequence = sequence;
      state.nextStop = state.stop_times[sequence];
    },

    updateLocation(
      state,
      action: PayloadAction<GeolocationPosition | undefined>
    ) {
      if (!action.payload) {
        state.location = undefined;
        state.distanceToNextStop = undefined;
        state.distanceToNextStopFormatted = undefined;
        return;
      }

      state.location = action.payload;
      state.nextStopDisplayMode = "IN_TRANSIT_TO";

      const { nextStop } = current(state);
      console.log(nextStop);
      if (nextStop?.stop?.location) {
        const [longitude, latitude] = nextStop?.stop?.location.coordinates;
        const distance = haversineDistance(action.payload.coords, {
          latitude,
          longitude,
        });

        state.distanceToNextStop = distance;
        if (distance < 0.5) {
          state.nextStopDisplayMode = "INCOMING_AT";
        }

        if (distance < 0.05) {
          state.nextStopDisplayMode = "STOPPED_AT";
        }

        if (distance < 1) {
          state.distanceToNextStopFormatted = `${Math.floor(distance * 1000)}m`;
        } else {
          state.distanceToNextStopFormatted = `${Math.floor(distance)}km`;
        }
      } else {
        state.distanceToNextStop = undefined;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchTripData.pending, () => {});

    builder.addCase(fetchTripData.fulfilled, (state, action) => {
      if (!action.payload.data) {
        return;
      }

      const { stop_times = [], trip_updates = [] } = action.payload.data;

      if (stop_times) {
        stop_times.sort((a, b) => a.stop_sequence! - b.stop_sequence!);

        state.stop_times = stop_times;
        state.nextStop = stop_times[0];
      }

      if (trip_updates) {
        state.trip_updates = trip_updates;
      }
    });

    builder.addCase(fetchTripData.rejected, (_, action) => {
      console.error(action);
    });
  },
});
export const { setStopSequence, updateLocation } = slice.actions;
export default slice.reducer;
