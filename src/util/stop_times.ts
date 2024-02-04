import { DateTime } from "luxon";
import { Components } from "../types/directus";

export const formatStopTimes = (
  stop_times: Components.Schemas.ItemsStopTimes[]
) =>
  [...stop_times]
    .sort((a, b) => a.stop_sequence! - b.stop_sequence!)
    .map((st) => {
      return {
        ...st,
        arrival: DateTime.fromISO(st.arrival!).toFormat("HH:mm"),
        departure: DateTime.fromISO(st.departure!).toFormat("HH:mm"),
      };
    });
