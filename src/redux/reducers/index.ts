import { combineReducers } from "redux";
import tripEditor from "./trip_editor";
import trip from "./trip";
import search from "./search";
import user from "./user";
import stopView from "./stop_view";
import driverApp from "./driver_app";

export const reducers = {
  trip,
  tripEditor,
  search,
  user,
  stopView,
  driverApp,
};

export type Reducers = typeof reducers;

export default combineReducers(reducers);
