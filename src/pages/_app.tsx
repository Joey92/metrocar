import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { Provider } from "react-redux";
import store from "../store";
import { AppProps } from "next/app";
import {
  checkLocation,
  fetchUserData,
  // fetchNotifications,
  refresh,
} from "../redux/reducers/user";
import { useAppDispatch, useAppSelector } from "../store";
import { appWithTranslation } from "next-i18next";

import "../App.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "leaflet/dist/leaflet.css";
import "../custom.scss";
// import "react-datetime-picker/dist/DateTimePicker.css";
// 1import "react-calendar/dist/Calendar.css";
import { SENTRY_DSN } from "../config";

if (SENTRY_DSN && SENTRY_DSN !== "") {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    environment: process.env.NODE_ENV,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.001 : 1.0,
  });
}

const App = ({ Component, pageProps }: AppProps) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.id);

  // useEffect(() => {
  //   if (!token) {
  //     localStorage.removeItem("authToken");
  //     return;
  //   }

  //   localStorage.setItem("authToken", token);
  // }, [token]);

  useEffect(() => {
    dispatch(refresh());
    dispatch(checkLocation());
  }, [dispatch]);

  useEffect(() => {
    if (!userId) {
      // no auth token set
      // if we had one then userID would be set in state
      return;
    }
    // we are fresh on the page
    // fetch user info that is not stored in token
    dispatch(fetchUserData());

    // setInterval(() => dispatch(fetchNotifications()), 30000);
  }, [dispatch, userId]);

  return (
    <React.StrictMode>
      <Component {...pageProps} />
    </React.StrictMode>
  );
};

const ReduxWrapper = (props: AppProps) => (
  <Provider store={store}>
    <App {...props}></App>
  </Provider>
);

export default Sentry.withProfiler(appWithTranslation(ReduxWrapper));
