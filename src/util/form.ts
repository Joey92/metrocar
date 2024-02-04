import backend from "../services/backend";
import { CoordinateSelectValue } from "../types/types";

export const handleAutocomplete =
  (locationBias?: GeolocationPosition) => async (q: string) => {
    if (q.length < 2) {
      return [];
    }

    let lat;
    let lon;

    if (locationBias) {
      const {
        coords: { latitude, longitude },
      } = locationBias;

      lat = latitude;
      lon = longitude;
    }

    const resp = await backend.get<CoordinateSelectValue[]>("/autocomplete", {
      params: { q, lat, lon },
    });
    return resp.data;
  };
