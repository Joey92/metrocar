import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import backend from "../../services/backend";
import { RootState } from "../../store";
import { Itinerary, SearchResponse } from "../../types/backend";
import { CoordinateSelectValue, SelectValue } from "../../types/types";

export const searchTrip = createAsyncThunk<
  SearchResponse,
  void,
  { state: RootState; rejectValue: SearchError }
>("search/searchTrip", async (_, { rejectWithValue, getState }) => {
  const {
    from,
    to,
    date = DateTime.now().toMillis(),
    arriveBy = false,
  } = getState().search;
  const location = getState().user.location;
  const dateTime = DateTime.fromMillis(date);

  if (!to) {
    return rejectWithValue({
      field: "to",
      message: "pages:search.provide_input",
    });
  }

  if (!from && !location) {
    return rejectWithValue({
      field: "from",
      message: "pages:search.provide_input",
    });
  }

  const response = await backend({
    url: "/search",
    method: "GET",
    params: {
      from: from
        ? from.value
        : [location?.coords?.latitude, location?.coords?.longitude],
      fromName: from ? from.label : USER_LOCATION_VALUE,
      to: to.value,
      toName: to.label,
      time: dateTime.toFormat("HH:mm:ss").toLowerCase(),
      date: dateTime.toFormat("yyyyMMdd"),
      mode: "TRANSIT,WALK",
      maxWalkDistance: 500,
      arriveBy,
      wheelchair: false,
      debugItineraryFilter: true,
      locale: "en",
      showIntermediateStops: true,
      includePlannedCancellations: true,
    },
  });
  return response.data;
});

type Field = "from" | "to";
export const setFieldToCurrentLocation = createAsyncThunk<
  { field: Field; value: CoordinateSelectValue | null } | null,
  Field,
  { rejectValue: { field: Field; message: string }; state: RootState }
>("search/setCurrentLocation", async (field, { getState }) => {
  if (!field) {
    return null;
  }

  const pos = getState().user.location;

  if (pos) {
    return {
      field,
      value: {
        label: `translate.${USER_LOCATION_VALUE}`,
        value: [pos.coords.longitude, pos.coords.latitude],
      },
    };
  }

  return null;
});

export interface SearchError {
  field?: "from" | "to";
  message: string;
}

export interface State {
  error: SearchError | null;

  defaultOptions: SelectValue<any>[];
  from: CoordinateSelectValue | null;
  to: CoordinateSelectValue | null;
  location?: GeolocationPosition;
  arriveBy: boolean;
  date: number;

  itineraries: Itinerary[] | null;
  selectedItinary: number;
  loading: boolean;
  showFromField: boolean;

  searched: boolean; // if true then user has searched at least once
}

export const USER_LOCATION_VALUE = "USER_LOCATION";

const slice = createSlice({
  name: "search",
  initialState: {
    error: null,

    from: null,
    to: null,

    arriveBy: false,
    date: DateTime.now().toMillis(),

    itineraries: null,
    selectedItinary: 0,
    loading: false,
    defaultOptions: [
      {
        value: USER_LOCATION_VALUE,
        label: `translate.${USER_LOCATION_VALUE}`,
      },
    ],

    searched: false, // if true then user has searched at least once
  } as State,
  reducers: {
    setFrom(state, action: PayloadAction<CoordinateSelectValue | null>) {
      state.from = action.payload;
    },
    setTo(state, action: PayloadAction<CoordinateSelectValue | null>) {
      state.to = action.payload;
    },
    setDate(state, action: PayloadAction<number>) {
      state.date = action.payload;
    },
    flipFromTo(state) {
      const { from, to } = current(state);

      state.to = from;
      state.from = to;
    },
    hideFromField(state) {
      state.showFromField = false;
    },
    showFromField(state) {
      state.showFromField = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchTrip.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(searchTrip.fulfilled, (state, action) => {
      const {
        plan: { itineraries = [] },
      } = action.payload;

      state.loading = false;
      state.error = null;
      state.searched = true;
      state.itineraries = itineraries.map((itinerary) => ({
        ...itinerary,
        legs: itinerary.legs.map((leg) => ({
          ...leg,
          hailedCar: false,
          rentedCar: false,
          rentedBike: false,
          rentedVehicle: false,
          intermediateStops: leg.intermediateStops ? leg.intermediateStops : [],
          interlineWithPreviousLeg: leg.interlineWithPreviousLeg
            ? leg.interlineWithPreviousLeg
            : false,
        })),
      }));
    });

    builder.addCase(searchTrip.rejected, (state, action) => {
      state.loading = false;
      state.searched = true;

      if (action.payload) {
        state.error = action.payload;
      }
    });

    builder.addCase(setFieldToCurrentLocation.pending, (state, _) => {
      state.error = null;
    });

    builder.addCase(setFieldToCurrentLocation.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }

      const { field, value } = action.payload;

      switch (field) {
        case "from":
          state.from = value;
          break;
        case "to":
          state.to = value;
          break;
        default:
          return;
      }
    });

    builder.addCase(setFieldToCurrentLocation.rejected, (state, action) => {
      if (!action.payload) {
        return;
      }

      const { field, message } = action.payload;
      state.error = { field, message };
    });
  },
});

export const { setDate, flipFromTo, setFrom, setTo } = slice.actions;

export default slice.reducer;
