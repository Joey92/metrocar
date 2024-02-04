import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import backendApi from "../../services/backend";
import {
  NavigateResponse,
  Route,
  NavigateResponseError,
  StopOnATrip,
  MeasuredStop,
  Points,
} from "../../types/backend";
import { AxiosError } from "axios";
import { RootState } from "../../store";
import { Components, DirectusResponse } from "../../types/directus";
import api from "../../services/directus";
import { CoordinateSelectValue, SelectValue } from "../../types/types";

export type Waypoint = [number, number];

export const fetchOnRouteStops = createAsyncThunk<
  | (NavigateResponse & {
      fromSearch?: CoordinateSelectValue | null;
      toSearch?: CoordinateSelectValue | null;
    })
  | undefined,
  void,
  { state: RootState; rejectValue: NavigateResponseError }
>("trip_editor/fetchOnRouteStops", async (_, { rejectWithValue, getState }) => {
  // use getState to get the data
  const { from, to } = getState().search;
  const { waypoints } = getState().tripEditor;

  if (!from) {
    return rejectWithValue({
      error: true,
      field: "from",
      message: "required",
    });
  }

  if (!to) {
    return rejectWithValue({
      error: true,
      field: "to",
      message: "required",
    });
  }

  try {
    const response = await backendApi.post<NavigateResponse>("/fetchStops", {
      waypoints: [from.value, ...waypoints, to.value],
    });

    return { fromSearch: from, toSearch: to, ...response.data };
  } catch (err) {
    if (err instanceof AxiosError) {
      return rejectWithValue(err.response?.data);
    }

    throw err;
  }
});

export const getVehicles = createAsyncThunk(
  "trip_editor/vehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        DirectusResponse<Components.Schemas.ItemsVehicles[]>
      >("/items/vehicles", {
        params: {
          filter: {
            owner: {
              _eq: "$CURRENT_USER",
            },
          },
        },
      });
      return response.data.data!;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data);
      }
    }
  }
);

export const createVehicle = createAsyncThunk(
  "trip_editor/creatVehicle",
  async (
    { description, licenseplate }: Components.Schemas.ItemsVehicles,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/items/vehicles", {
        description,
        licenseplate,
      });
      return response.data.data!;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data);
      }
    }
  }
);

export const persistTrip = createAsyncThunk<
  undefined,
  boolean | undefined,
  { state: RootState; rejectValue: NavigateResponseError }
>(
  "trip_editor/persistTrip",
  async (withAgency = false, { rejectWithValue, getState }) => {
    const {
      stops,
      start_date,
      end_date,
      calendar,
      reoccurring,
      vehicle,
      route,
    } = getState().tripEditor;

    const agency = withAgency
      ? getState().user.selectedAgency || undefined
      : undefined;

    try {
      const response = await backendApi.post("/trips", {
        stops: stops.map((stop) => ({
          id: stop.id || uuid(),
          stop_name: stop.id ? undefined : stop.stop_name,
          location: stop.location,
          arrivalOffset: stop.arrivalOffset,
          departureOffset: stop.departureOffset,
          distance: stop.distance,
          selected: stop.features.selected,
          private: stop.id ? false : true,
        })),
        start_date: DateTime.fromMillis(start_date).toISO(),
        end_date: reoccurring
          ? DateTime.fromMillis(end_date).toISO()
          : undefined,
        calendar: reoccurring ? calendar : undefined,
        vehicle,
        agency,
      });
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(err.response?.data);
      }
    }
  }
);

const calculateAdditionalTimeOnStops = (stops: StopOnATrip[]) =>
  stops
    .reduce(
      (times, stop, idx) => {
        if (idx === 0) {
          times.push({
            arrivalOffset: 0,
            departureOffset: stop.stopDuration * 60000,
            originalArrivalTime: 0,
          });
          return times;
        }

        const { departureOffset: prevDepartureOffset, originalArrivalTime } =
          times[idx - 1];
        const driveDuration = stop.time - originalArrivalTime;
        const arrivalOffset = prevDepartureOffset + driveDuration;

        if (stop.features.selected) {
          times.push({
            arrivalOffset,
            departureOffset: arrivalOffset + stop.stopDuration * 60000,
            originalArrivalTime: stop.time,
          });
        } else {
          // ignore the stop duration for not selected stops
          times.push({
            arrivalOffset,
            departureOffset: arrivalOffset,
            originalArrivalTime: stop.time,
          });
        }

        return times;
      },
      [] as {
        arrivalOffset: number;
        departureOffset: number;
        originalArrivalTime: number;
      }[]
    )
    .map((times, idx) => ({
      ...stops[idx],
      arrivalOffset: times.arrivalOffset,
      departureOffset: times.departureOffset,
    }));

const calculateLineType = (stops: StopOnATrip[]) => {
  const enabledStops = stops.filter((s) => s.features.selected);

  switch (true) {
    case enabledStops.length === stops.length:
      return "Local";
    case enabledStops.length > stops.length / 2:
      return "Limited";
    case enabledStops.length > 2:
    default:
      return "Limited-Express";
    case enabledStops.length === 2:
      return "Express";
  }
};

export interface State {
  id: string;

  from?: StopOnATrip;
  to?: StopOnATrip;

  start_date: number;
  end_date: number;
  min_start_date: number;
  min_end_date: number;
  max_start_date: number;
  max_end_date: number;

  calendar: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };

  lineType: "Local" | "Limited" | "Limited-Express" | "Express";

  stops: StopOnATrip[];
  waypoints: Waypoint[];
  navigationRoute: Points | null;

  route?: SelectValue<string> | null;

  persisted: boolean;
  error: NavigateResponseError | null;

  search_loading: boolean;
  saving: boolean;

  reoccurring: boolean;

  vehicles_loading: boolean;
  vehicle: string | null;
  vehicles: Components.Schemas.ItemsVehicles[];
}

const initialState = (): State => {
  const min_start_date = DateTime.now();
  const min_end_date = min_start_date.plus({ days: 7 });
  const max_end_date = min_start_date.plus({ days: 30 });
  const max_start_date = min_start_date.plus({ years: 1 });

  return {
    id: uuid(),

    from: undefined,
    to: undefined,

    start_date: min_start_date.toMillis(),
    end_date: min_end_date.toMillis(),
    min_start_date: min_start_date.toMillis(),
    min_end_date: min_end_date.toMillis(),
    max_start_date: max_start_date.toMillis(),
    max_end_date: max_end_date.toMillis(),

    calendar: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },

    lineType: "Local",

    stops: [],
    waypoints: [],
    navigationRoute: null,

    persisted: false,
    error: null,

    // loaders
    search_loading: false,
    saving: false,

    reoccurring: false,

    vehicles_loading: false,
    vehicle: null,
    vehicles: [],
  };
};

/**
 *
 * @param stop The MeasuredStop to wrap
 * @param duration Amount of minutes stopping time
 * @returns StopOnATrip
 */
const initStopOnATrip = (stop: MeasuredStop, duration: number) =>
  ({
    ...stop,
    stopDuration: duration,
    features: {
      selected: true,
      enter: true,
      exit: true,
    },
  } as StopOnATrip);

const slice = createSlice({
  name: "trip_editor",
  initialState: initialState(),

  extraReducers: (builder) => {
    builder.addCase(fetchOnRouteStops.pending, (state, _) => {
      state.search_loading = true;
      state.error = null;
    });

    builder.addCase(fetchOnRouteStops.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }

      const {
        waypointInfo: stops,
        route,
        fromSearch,
        toSearch,
      } = action.payload;

      state.stops = calculateAdditionalTimeOnStops(
        stops
          .map((s, idx) => initStopOnATrip(s, idx == 0 ? 0 : 3))
          .map((stop) => {
            if (stop.stop_name == "origin") {
              return {
                ...stop,
                stop_name: fromSearch?.label,
                location: {
                  type: "POINT",
                  coordinates: fromSearch?.value,
                },
              };
            }

            if (stop.stop_name == "destination") {
              return {
                ...stop,
                stop_name: toSearch?.label,
                location: {
                  type: "POINT",
                  coordinates: toSearch?.value,
                },
              };
            }

            return stop;
          })
      );

      state.navigationRoute = route;

      state.search_loading = false;
      state.error = null;
    });

    builder.addCase(fetchOnRouteStops.rejected, (state, action) => {
      state.search_loading = false;
      state.error = action.payload || null;
    });

    builder.addCase(persistTrip.pending, (state) => {
      state.saving = true;
    });

    builder.addCase(persistTrip.fulfilled, (state) => {
      state.persisted = true;
    });

    builder.addCase(persistTrip.rejected, (state, action) => {
      const { message = "generic", field } = action.payload!;
      state.saving = false;
      state.error = {
        field,
        message: `pages:trip_editor.errors.${message}`,
      };
    });

    builder.addCase(getVehicles.pending, (state, _) => {
      state.vehicles_loading = true;
    });

    builder.addCase(getVehicles.fulfilled, (state, action) => {
      state.vehicles_loading = false;
      state.vehicles = action.payload!;
    });

    builder.addCase(getVehicles.rejected, (state, action: any) => {
      state.vehicles_loading = false;
      //state.errors = action.payload.error;
      console.log(action.payload);
    });

    builder.addCase(createVehicle.pending, (state, _) => {
      state.vehicles_loading = true;
    });

    builder.addCase(createVehicle.fulfilled, (state, action) => {
      state.vehicles_loading = false;
      state.vehicles.push(action.payload);
    });

    builder.addCase(createVehicle.rejected, (state, action: any) => {
      state.vehicles_loading = false;
    });
  },

  reducers: {
    reset() {
      return initialState();
    },
    setFrom(state, action: PayloadAction<State["from"]>) {
      state.from = action.payload;
    },

    setTo(state, action: PayloadAction<State["to"]>) {
      state.to = action.payload;
    },

    setRoute(state, action: PayloadAction<State["route"]>) {
      state.route = action.payload;
    },

    addStop(state, action: PayloadAction<Components.Schemas.ItemsStops>) {
      const stop = {
        ...action.payload,
        distance: 0,
        time: 0,
        stopDuration: 3, // give 3 extra minutes to every stop
        features: {
          selected: true,
          enter: true,
          exit: true,
        },
      } as StopOnATrip;
      state.stops.push(stop);
      state.stops = calculateAdditionalTimeOnStops(state.stops);
    },

    removeStop(state, action: PayloadAction<number>) {
      state.stops.splice(action.payload, 1);
      state.stops = calculateAdditionalTimeOnStops(state.stops);
    },

    setVehicle(state, action: PayloadAction<string>) {
      state.vehicle = action.payload;
    },

    setStartDate(state, action) {
      const startDate = action.payload;

      // update dates if start_date has changed
      const chosenDate = DateTime.fromJSDate(startDate);

      state.min_end_date = chosenDate.plus({ days: 7 }).toMillis();
      state.max_end_date = chosenDate.plus({ days: 30 }).toMillis();
      state.start_date = chosenDate.toMillis();
    },

    setEndDate(state, action) {
      const endDate = action.payload;

      // update dates if start_date has changed
      const chosenDate = DateTime.fromJSDate(endDate);
      state.end_date = chosenDate.toMillis();
    },

    toggleCalendarDay(state, action: PayloadAction<keyof State["calendar"]>) {
      const day = action.payload;
      state.calendar[day] = !state.calendar[day];
    },

    toggleReoccurring(state) {
      state.reoccurring = !state.reoccurring;
    },

    offsetStopDeparture(state, action) {
      const { stops } = state;
      const { index, mins } = action.payload;

      stops[index].stopDuration = mins;

      state.stops = calculateAdditionalTimeOnStops(stops);
    },

    toggleStopFeature(
      state,
      action: PayloadAction<{
        index: number;
        feature: keyof StopOnATrip["features"];
      }>
    ) {
      const { stops } = state;

      const { feature, index } = action.payload;
      stops[index].features[feature] = !stops[index].features[feature];
      const selectedStops = stops.filter((s) => s.features.selected);

      let error = null;
      if (selectedStops.length < 2) {
        stops[index].features[feature] = !stops[index].features[feature]; // undo the change
        error = {
          error: true,
          field: "stops",
          message: "pages:trip_editor.errors.trip_minimum_stations",
        };
      }

      if (
        !selectedStops[0].features.enter ||
        !selectedStops[selectedStops.length - 1].features.exit
      ) {
        error = {
          error: true,
          field: "stops",
          message: "pages:trip_editor.errors.enter_exit_required",
        };
      }

      state.error = error;
      state.stops = calculateAdditionalTimeOnStops(stops);
      state.lineType = calculateLineType(stops);
    },

    addWaypoint(state, action: PayloadAction<Waypoint>) {
      state.waypoints.push(action.payload);
    },

    deleteWaypoint(state, action: PayloadAction<number>) {
      state.waypoints.splice(action.payload, 1);
    },

    updateWaypoint(
      state,
      action: PayloadAction<{ idx: number; waypoint: Waypoint }>
    ) {
      const { idx, waypoint } = action.payload;
      state.waypoints[idx] = waypoint;
    },
  },
});

export const {
  setFrom,
  setTo,
  setRoute,
  setStartDate,
  setEndDate,
  offsetStopDeparture,
  toggleStopFeature,
  toggleCalendarDay,
  toggleReoccurring,
  addWaypoint,
  deleteWaypoint,
  updateWaypoint,
  setVehicle,
  reset,
  addStop,
  removeStop,
} = slice.actions;
export default slice.reducer;
