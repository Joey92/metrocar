import { JwtAuth, parseJwt } from "../../util/auth";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { axiosConfigDefaults } from "../../services/directus";

import {
  Components,
  DirectusResponse,
  Error as DirectusError,
  Paths,
} from "../../types/directus";
import axios, { AxiosError } from "axios";

interface LoginInput {
  email: string;
  password: string;
  otp?: string;
}
export const login = createAsyncThunk<
  Paths.Login.Responses.$200,
  Paths.Login.RequestBody,
  { rejectValue: DirectusError }
>("user/login", async ({ email, password, otp }, { rejectWithValue }) => {
  return api
    .post<Paths.Login.Responses.$200>("/auth/login", {
      email,
      password,
      otp,
      mode: "cookie",
    })
    .then((resp) => resp.data)
    .catch((resp: AxiosError<DirectusError>) =>
      rejectWithValue(resp.response?.data!)
    );
});

export const refresh = createAsyncThunk("user/refresh", async () => {
  // don't use api client to not send auth token
  const response = await axios.post(
    "/auth/refresh",
    undefined,
    axiosConfigDefaults
  );

  return response.data.data!;
});

export const fetchUserData = createAsyncThunk("user/me", async () => {
  const response = await api.get<
    DirectusResponse<
      Components.Schemas.Users & {
        agencies: {
          agencies_id: Components.Schemas.ItemsAgencies;
        }[];
      }
    >
  >("/users/me", {
    params: {
      fields: [
        "display_name",
        "language",
        "agencies.agencies_id.id",
        "agencies.agencies_id.agency_name",
      ],
    },
  });
  return response.data.data!;
});

export const checkLocation = createAsyncThunk(
  "user/location",
  async (_, { rejectWithValue }) => {
    if ("geolocation" in navigator) {
      try {
        const getPositionPromise = new Promise<GeolocationPosition>(
          (success, reject) =>
            navigator.geolocation.getCurrentPosition(success, reject)
        );

        const pos = await getPositionPromise;
        return pos;
      } catch (e) {
        if (e instanceof Error) {
          return rejectWithValue(e.message);
        }

        return rejectWithValue(
          "Geolocation not enabled. Probably due to non secure environment."
        );
      }
    }
    return rejectWithValue(
      "Geolocation not enabled. Probably due to non secure environment."
    );
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  const response = await api.post("/auth/logout");

  return response.data.data!;
});

export const update = createAsyncThunk(
  "user/update",
  async (data: Components.Schemas.Users) => {
    const response = await api.patch<
      DirectusResponse<Components.Schemas.Users>
    >("/users/me", data, {
      params: {
        fields: ["id"],
      },
    });
    return response.data.data!;
  }
);

export const fetchNotifications = createAsyncThunk(
  "user/fetchNotifications",
  async () => {
    const response = await api.get("/notifications", {
      params: {
        aggregate: {
          count: "id",
        },
        filter: {
          status: {
            _eq: "inbox",
          },
        },
      },
    });
    return response.data.data!;
  }
);

export const ticketRequest = createAsyncThunk(
  "trip/ticketRequest",
  async ({
    trip,
    start_date,
    origin_stop_sequence,
    destination_stop_sequence,
  }: Components.Schemas.ItemsTickets) => {
    const resp = await api.post<
      DirectusResponse<Components.Schemas.ItemsTickets[]>
    >("/items/tickets", {
      trip,
      start_date,
      origin_stop_sequence,
      destination_stop_sequence,
    });

    return resp.data.data!;
  }
);

interface State {
  token?: string | null; // null indicates that no token has been found: redirect to login
  id?: string | null;
  username?: string | null;
  language: string;
  loading: boolean;
  errors: string[];
  otpNeeded?: boolean;
  agencies: Components.Schemas.ItemsAgencies[];
  selectedAgency?: string;
  location?: GeolocationPosition;

  notificationAmount: number;
  userdataLoaded: boolean;

  permissions?: {
    [index: string]: ("read" | "create" | "delete" | "update")[];
  };
}

const slice = createSlice({
  name: "user",
  initialState: {
    id: null,
    username: null,
    language: "en",
    notifications: [],
    userdataLoaded: false,
    notificationAmount: 0,
    agencies: [],

    // login
    loading: false,
    errors: [],
    otpNeeded: undefined,
  } as State,

  reducers: {
    setSelectedAgency(state, action: PayloadAction<string>) {
      state.selectedAgency = action.payload;
      window.localStorage.setItem("selectedAgency", action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      try {
        const access_token = action.payload.data!.access_token!;
        const parsedJwt = parseJwt<JwtAuth>(access_token);
        state.token = access_token;

        localStorage.setItem("authToken", access_token);

        state.id = parsedJwt!.id;
        state.loading = false;
      } catch (e) {
        console.error(e);
        state.errors = ["GENERIC"];
        return;
      }
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.errors = [];

      if (!action.payload) {
        state.errors = ["GENERIC"];
        return;
      }

      const { errors } = action.payload as DirectusError;
      if (errors) {
        const otp = errors.find((err) => err.extensions.code === "INVALID_OTP");

        if (otp && !state.otpNeeded) {
          state.otpNeeded = true;
          return;
        }
      }

      state.errors = errors.map((error) => error.extensions.code);
    });

    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(logout.fulfilled, (state) => {
      window.localStorage.removeItem("authToken");

      state.id = null;
      state.loading = false;

      document.location.href = "/";
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.errors = [];

      if (!action.payload) {
        state.errors = ["generic_error"];
        return;
      }

      const { errors } = action.payload as DirectusError;
      state.errors = errors.map((error) => error.extensions.code);
    });

    builder.addCase(refresh.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(refresh.fulfilled, (state, action) => {
      const { access_token } = action.payload!;
      const parsedJwt = parseJwt<JwtAuth>(access_token!);
      state.token = access_token!;

      localStorage.removeItem("authToken");
      localStorage.setItem("authToken", access_token);

      state.id = parsedJwt!.id;
      state.loading = false;
    });

    builder.addCase(refresh.rejected, (state, action) => {
      state.token = null;
      state.loading = false;
      state.errors = [];

      if (!action.payload) {
        return;
      }

      const { errors } = action.payload as DirectusError;

      state.errors = errors.map((error) => error.extensions.code);
    });

    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notificationAmount = action.payload[0].count.id;
    });

    builder.addCase(fetchNotifications.rejected, (state, action: any) => {
      state.errors = action.payload;
    });

    builder.addCase(fetchUserData.pending, () => {});

    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const { display_name, language, agencies = [] } = action.payload!;
      state.username = display_name!;

      if (language) {
        state.language = language!;
      }
      state.userdataLoaded = true;

      if (agencies.length == 0) {
        return;
      }

      const agenciesList = agencies.map((a) => a.agencies_id);
      state.agencies = agenciesList;
      if (state.selectedAgency) {
        // we already have an agency selected, return
        return;
      }

      // check if we have the agency selected previously
      const selectedAgency = window.localStorage.getItem("selectedAgency");
      if (selectedAgency) {
        state.selectedAgency = selectedAgency;
        return;
      }

      // set the first agency in the list as the selected agency
      const agencyId = agenciesList[0].id!;
      window.localStorage.setItem("selectedAgency", agencyId);
      state.selectedAgency = agencyId;
    });

    builder.addCase(fetchUserData.rejected, (_, action) => {
      console.error(action.payload);
    });

    builder.addCase(checkLocation.pending, () => {});
    builder.addCase(checkLocation.fulfilled, (state, action) => {
      state.location = action.payload;
    });
    builder.addCase(checkLocation.rejected, (_, action) => {
      console.error(action.payload);
    });
  },
});

export const { setSelectedAgency } = slice.actions;
export default slice.reducer;
