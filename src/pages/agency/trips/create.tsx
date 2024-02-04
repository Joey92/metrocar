import React, { useEffect, useMemo, useState } from "react";
// @ts-ignore: missing @types.. but they are actually there?
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";
// import DatePicker from "react-date-picker";
import * as actions from "../../../redux/reducers/trip_editor";
import { DateTime } from "luxon";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import Alert from "react-bootstrap/Alert";

import ListGroup from "react-bootstrap/ListGroup";
import { useTranslation } from "next-i18next";
import { FaStopwatch } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import Container from "react-bootstrap/Container";

import { useAppSelector, useAction } from "../../../store";
import dynamic from "next/dynamic";

import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../../components/layouts/Standard";
import { useRouter } from "next/router";
import { useUser } from "../../../util/hooks";
import Tutorial, { useTutorial } from "../../../components/Tutorial";
import { Stack } from "react-bootstrap";

import { Searcher } from "fast-fuzzy";
import api from "../../../services/directus";
import { Components, DirectusResponse } from "../../../types/directus";
import Select from "react-select";
import { SelectValue } from "../../../types/types";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const TripEditor: NextPage = () => {
  const router = useRouter();

  const addStop = useAction(actions.addStop);

  const setStartDate = useAction(actions.setStartDate);
  // setEndDate
  const offsetStopDeparture = useAction(actions.offsetStopDeparture);
  const toggleStopFeature = useAction(actions.toggleStopFeature);
  const calculateRouteBetweenStops = useAction(actions.fetchOnRouteStops);
  const persistTrip = useAction(actions.persistTrip);

  const setRoute = useAction(actions.setRoute);
  const [availableRoutes, setAvailableRoutes] = useState(
    undefined as SelectValue<string>[] | undefined
  );

  const loadAvailableRoutes = () => {
    return api
      .get<DirectusResponse<Components.Schemas.ItemsRoutes[]>>(
        "/items/routes",
        {
          params: {
            filters: {
              agency: {
                _eq: selectedAgency,
              },
            },
          },
        }
      )
      .then((resp) =>
        setAvailableRoutes(
          resp.data.data.map((route) => ({
            label: route.route_short_name,
            value: route.id,
          }))
        )
      );
  };

  const { tutorials, add: addTutorial } = useTutorial();

  const [advanced, setAdvanced] = useState(false);
  const [loadingAvailableStops, setLoadingAvailableStops] = useState(false);
  const [availableStops, setAvailableStops] = useState(
    null as Components.Schemas.ItemsStops[] | null
  );

  const {
    start_date,
    end_date,
    stops,
    navigationRoute,
    min_start_date,
    min_end_date,
    max_start_date,
    max_end_date,
    error,

    saving,

    calendar,
    reoccurring: reoccuring,
    waypoints,

    persisted,
    route,
  } = useAppSelector((state) => state.tripEditor);

  const selectedAgency = useAppSelector((state) => state.user.selectedAgency);

  // keeping track of the stop amount to control when we request navigation between stops.
  // If we would not do this the navigation request will run the effect endlessly
  const [stopAmount, setStopAmount] = useState(undefined as number | undefined);

  useEffect(() => {
    if (persisted) {
      router.push("/agency/trips");
    }
  }, [router, persisted]);

  // whenever stops are added or removed we request a route between the stops
  // this will also pre-fill the scheduled arrival and departure time
  useEffect(() => {
    if (stopAmount === undefined) {
      setStopAmount(stops.length);
      return;
    }

    stops.length > 1 &&
      stops.length != stopAmount &&
      calculateRouteBetweenStops() &&
      setStopAmount(stops.length);
  }, [stopAmount, stops, calculateRouteBetweenStops]);

  // fetch all available stops the agency has
  useEffect(() => {
    setLoadingAvailableStops(true);
    api
      .get<DirectusResponse<Components.Schemas.ItemsStops[]>>("/items/stops", {
        params: {
          filters: {
            agency: {
              _eq: selectedAgency,
            },
          },
        },
      })
      .then((resp) => setAvailableStops(resp.data.data))
      .finally(() => setLoadingAvailableStops(false));
  }, [selectedAgency]);

  // create a fuzzy matcher for the autocomplete form fields
  const autocompleteOptions = useMemo(() => {
    if (!availableStops) {
      return;
    }

    const options = availableStops
      .map((options) => ({ label: options.stop_name, value: options.id }))
      .filter((o) => o.value && o.label);

    const searcher = new Searcher(options, {
      keySelector: (option) => option.label!,
    });
    return (search: string) => {
      if (search.length === 0) {
        return Promise.resolve(options);
      }
      return Promise.resolve(searcher.search(search));
    };
  }, [availableStops]);

  // list of stops indexed by their ID
  const stopById = useMemo(() => {
    if (!availableStops) {
      return {};
    }

    return availableStops.reduce((acc, stop) => {
      if (!stop.id || stop.id in acc) {
        return acc;
      }

      acc[stop.id] = stop;
      return acc;
    }, {} as Record<string, Components.Schemas.ItemsStops>);
  }, [availableStops]);

  const { t } = useTranslation();

  const Map = React.useMemo(
    () =>
      dynamic(
        () => import("../../../components/maps/TripCreateMap"), // replace '@components/map' with your component's location
        {
          loading: () => <p>Map is Loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [
      /* list variables which should trigger a re-render here */
    ]
  );

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Tutorial tutorials={tutorials} />
      <Container style={{ marginTop: ".75rem" }}>
        <Form
          onSubmit={(evt) => {
            evt.preventDefault();
            persistTrip();
          }}
        >
          <Stack gap={3}>
            {error && !error?.field && (
              <Alert variant="danger">{error?.message}</Alert>
            )}
            <div>
              <Map
                stops={stops}
                routeShapeCoordinates={navigationRoute?.coordinates.map((c) => [
                  c[1],
                  c[0],
                ])}
              />
            </div>
            {/* use react select or switch to MUI */}

            <Stack gap={3}>
              <Form.Group controlId="departureTime">
                <Form.Label>{t("Assign a route?")}</Form.Label>
                <Select
                  onFocus={loadAvailableRoutes}
                  options={availableRoutes}
                  onChange={setRoute}
                  placeholder={t(
                    "Select an existing route. Keep empty to create a new one."
                  )}
                  isClearable
                  isLoading={loadingAvailableStops}
                />
              </Form.Group>

              <Form.Group controlId="departureTime">
                <Form.Label>{t("pages:trip_editor.departure_time")}</Form.Label>
                <DateTimePicker
                  calendarClassName="calendar-extra"
                  disableClock
                  minDate={DateTime.fromMillis(min_start_date).toJSDate()}
                  maxDate={DateTime.fromMillis(max_start_date).toJSDate()}
                  onChange={setStartDate}
                  value={DateTime.fromMillis(start_date).toJSDate()}
                />
              </Form.Group>

              <Form.Check
                onChange={() => setAdvanced(!advanced)}
                checked={advanced}
                type="switch"
                id="custom-switch"
                label={t("pages:trip_editor.advanced")}
                ref={addTutorial({
                  header: t("pages:trip_editor.tutorials.advanced.header"),
                  body: t("pages:trip_editor.tutorials.advanced.body"),
                })}
              />

              {error?.field === "stops" && (
                <Alert variant="danger">{t(error?.message)}</Alert>
              )}

              <ListGroup>
                {stops.map((stop, stopIdx) => (
                  <ListGroup.Item key={stop.id}>
                    <Stack direction="horizontal" gap={3}>
                      <Form.Group controlId={`stop-${stop.id}`}>
                        <Form.Check
                          label={
                            stop.features.selected ? (
                              stop.stop_name
                            ) : (
                              <>Disabled: {stop.stop_name}</>
                            )
                          }
                          type="checkbox"
                          checked={stop.features.selected}
                          onChange={() =>
                            toggleStopFeature({
                              index: stopIdx,
                              feature: "selected",
                            })
                          }
                          ref={addTutorial({
                            header: t(
                              "pages:trip_editor.tutorials.stop-select.header"
                            ),
                            body: t(
                              "pages:trip_editor.tutorials.stop-select.body"
                            ),
                          })}
                        />
                        <Form.Text className="text-muted">
                          {t("pages:trip_editor.departure_at", {
                            time: DateTime.fromMillis(start_date)
                              .plus(stop.departureOffset)
                              .toFormat("HH:mm"),
                          })}
                        </Form.Text>
                      </Form.Group>
                      {advanced && (
                        <Form.Group className="ms-auto" controlId="minutes">
                          <InputGroup>
                            <InputGroup.Text>
                              <FaStopwatch />
                            </InputGroup.Text>
                            <Form.Control
                              min="0"
                              max="120"
                              disabled={!stop.features.selected}
                              required
                              type="number"
                              ref={addTutorial({
                                header: t(
                                  "pages:trip_editor.tutorials.time.header"
                                ),
                                body: t(
                                  "pages:trip_editor.tutorials.time.body"
                                ),
                              })}
                              value={
                                stop.features.selected
                                  ? stop.stopDuration || 0
                                  : 0
                              }
                              onChange={(e) =>
                                offsetStopDeparture({
                                  index: stopIdx,
                                  mins: parseInt(e.target.value),
                                })
                              }
                            />
                            <InputGroup.Text>
                              {t("pages:trip_editor.min_abbr")}
                            </InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      )}
                    </Stack>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <Form.Group controlId="addStop">
                    <Form.Label>
                      {t("pages:trip_editor.origin.label")}
                    </Form.Label>
                    <AsyncSelect
                      placeholder={t("pages:trip_editor.origin.placeholder")}
                      onChange={(val) => {
                        if (!val || !val.value) {
                          return;
                        }

                        if (val.value in stopById) {
                          addStop(stopById[val.value]);
                        }
                      }}
                      loadOptions={autocompleteOptions}
                      isLoading={!availableStops}
                    />
                    {error?.field === "from" && (
                      <span>{t(error?.message)}</span>
                    )}
                  </Form.Group>
                </ListGroup.Item>
              </ListGroup>

              <Button
                disabled={saving || !navigationRoute}
                type="submit"
                variant="primary"
                size="lg"
              >
                {saving ? (
                  <Spinner animation="border" />
                ) : (
                  t("pages:trip_editor.insert_trip")
                )}
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Container>
    </StandardLayout>
  );
};

export default TripEditor;
