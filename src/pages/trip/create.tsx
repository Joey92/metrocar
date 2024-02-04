import React, { useEffect, useMemo, useState } from "react";
// @ts-ignore: missing @types.. but they are actually there?
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";
// import DatePicker from "react-date-picker";
import * as actions from "../../redux/reducers/trip_editor";
import * as searchActions from "../../redux/reducers/search";
import { DateTime } from "luxon";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

import ListGroup from "react-bootstrap/ListGroup";
import { useTranslation } from "next-i18next";
import { FaMapMarkerAlt, FaStopwatch } from "react-icons/fa";
import { handleAutocomplete } from "../../util/form";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import VehicleForm from "../../components/VehicleForm";
import Container from "react-bootstrap/Container";

import { throttle } from "lodash";
import { useAppSelector, useAction } from "../../store";
import dynamic from "next/dynamic";

import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../components/layouts/Standard";
import { useRouter } from "next/router";
import { useUser } from "../../util/hooks";
import Tutorial, { useTutorial } from "../../components/Tutorial";
import { Stack } from "react-bootstrap";
import Head from "next/head";
import { SelectValue } from "../../types/types";
import GeolocationAsyncSelect from "../../components/GeolocationAsyncSelect";
import { StopOnATrip } from "../../types/backend";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const TripEditor: NextPage = () => {
  const userId = useUser(); // this will redirect to login if noone is logged in

  const setFrom = useAction(searchActions.setFrom);
  const setTo = useAction(searchActions.setTo);

  const fetchVehicles = useAction(actions.getVehicles);
  const setStartDate = useAction(actions.setStartDate);
  // setEndDate
  const offsetStopDeparture = useAction(actions.offsetStopDeparture);
  const toggleStopFeature = useAction(actions.toggleStopFeature);
  // toggleCalendarDay
  // toggleReoccuring
  const addWaypoint = useAction(actions.addWaypoint);
  const deleteWaypoint = useAction(actions.deleteWaypoint);
  const updateWaypoint = useAction(actions.updateWaypoint);
  const setVehicle = useAction(actions.setVehicle);
  const fetchOnRouteStops = useAction(actions.fetchOnRouteStops);
  const persistTrip = useAction(actions.persistTrip);
  const reset = useAction(actions.reset);

  const { tutorials, add: addTutorial } = useTutorial();
  const { location } = useAppSelector((state) => state.user);

  const [advanced, setAdvanced] = useState(false);
  const [createVehicleModal, setCreateVehicleModal] = useState(false);

  const StopItem = ({
    stop,
    stopIdx,
  }: {
    stop: StopOnATrip;
    stopIdx: number;
  }) => (
    <ListGroup.Item>
      <Stack direction="horizontal" gap={3}>
        <Form.Group controlId={`stop-${stopIdx}`}>
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
              header: t("pages:trip_editor.tutorials.stop-select.header"),
              body: t("pages:trip_editor.tutorials.stop-select.body"),
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
                  header: t("pages:trip_editor.tutorials.time.header"),
                  body: t("pages:trip_editor.tutorials.time.body"),
                })}
                value={stop.features.selected ? stop.stopDuration || 0 : 0}
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
  );

  const {
    start_date,
    end_date,
    stops,
    navigationRoute: route,
    min_start_date,
    min_end_date,
    max_start_date,
    max_end_date,
    error,

    saving,

    calendar,
    reoccurring: reoccuring,
    waypoints,

    from,
    to,

    persisted,

    vehicle,
    vehicles,
  } = useAppSelector((state) => state.tripEditor);

  const { from: searchFrom, to: searchTo } = useAppSelector(
    (state) => state.search
  );

  const vehicleList = useMemo(
    () =>
      vehicles.map((v) => ({
        label: v.licenseplate,
        value: v.id,
      })),
    [vehicles]
  );

  const selectedVehicle = useMemo(
    () => vehicleList.find((v) => v.value === vehicle),
    [vehicleList, vehicle]
  );

  const [fetchedVehicles, setFetchedVehicles] = useState(false);

  useEffect(() => {
    if (!fetchedVehicles) {
      fetchVehicles();
      setFetchedVehicles(true);
    }
  }, [fetchVehicles, fetchedVehicles]);

  // pre fill vehicle select when vehicles are available
  useEffect(() => {
    if (vehicleList.length === 0) {
      return;
    }
    // close vehicle creation form
    // because we have created a vehicle
    if (createVehicleModal) {
      setCreateVehicleModal(false);
    }

    setVehicle(vehicleList[0].value!);
  }, [vehicleList, setVehicle, createVehicleModal]);

  useEffect(() => {
    waypoints.length > 0 && fetchOnRouteStops();
  }, [waypoints, fetchOnRouteStops]);

  useEffect(() => {
    if (searchFrom && searchTo) {
      fetchOnRouteStops();
    }
  }, [fetchOnRouteStops, searchFrom, searchTo]);

  const router = useRouter();
  useEffect(() => {
    if (persisted) {
      router.push("/my/offers");
      reset();
    }
  }, [persisted, reset, router]);

  const loadOptions = useMemo(
    () =>
      throttle(handleAutocomplete(location), 500, {
        trailing: true,
        leading: true,
      }),
    [location]
  );

  const { t } = useTranslation();

  const Map = React.useMemo(
    () =>
      dynamic(
        () => import("../../components/maps/TripCreateMap"), // replace '@components/map' with your component's location
        {
          loading: () => <p>Map is Loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [
      /* list variables which should trigger a re-render here */
    ]
  );

  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:trip_editor.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:trip_editor.head.title")}
          key="title"
        />
      </Head>
      <Tutorial tutorials={tutorials} />
      <Container style={{ marginTop: ".75rem" }}>
        <Modal
          show={createVehicleModal}
          onHide={() => setCreateVehicleModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("pages:trip_editor.add_vehicle")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <VehicleForm />
          </Modal.Body>
        </Modal>

        <Form
          onSubmit={(evt) => {
            evt.preventDefault();
            if (!route) {
              fetchOnRouteStops();
              return;
            }

            persistTrip();
          }}
        >
          <Stack gap={3}>
            {/* use react select or switch to MUI */}
            <Form.Group controlId="departureFrom">
              <Form.Label>{t("pages:trip_editor.origin.label")}</Form.Label>
              <GeolocationAsyncSelect
                placeholder={t("pages:trip_editor.origin.placeholder")}
                value={searchFrom}
                onChange={setFrom}
              />
              {error?.field === "from" && <span>{t(error?.message)}</span>}
            </Form.Group>

            <Form.Group controlId="arrivalAt">
              <Form.Label>
                {t("pages:trip_editor.destination.label")}
              </Form.Label>
              <GeolocationAsyncSelect
                placeholder={t("pages:trip_editor.destination.placeholder")}
                value={searchTo}
                onChange={setTo}
              />

              {error?.field === "to" && <span>{t(error?.message)}</span>}
            </Form.Group>

            {route && (
              <Map
                routeShapeCoordinates={
                  route.coordinates.map((c) => [c[1], c[0]]) as [
                    number,
                    number
                  ][] // flip coordinates for leaflet
                }
                stops={stops}
                waypoints={waypoints}
                deleteWaypoint={deleteWaypoint}
                addWaypoint={addWaypoint}
                updateWaypoint={(idx, wp) =>
                  updateWaypoint({ idx, waypoint: wp })
                }
              />
            )}

            {route && stops.length === 0 && (
              <Alert variant="danger">
                {t("pages:trip_editor.no_stops_for_trip")}
              </Alert>
            )}

            {stops.length > 0 && (
              <Stack gap={3}>
                <Form.Group controlId="departureTime">
                  <Form.Label>
                    {t("pages:trip_editor.departure_time")}
                  </Form.Label>
                  <DateTimePicker
                    className="form-control"
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
                  {[from, ...stops, to]
                    .filter((stop) => !!stop)
                    .map((stop, idx) => (
                      <StopItem stop={stop!} stopIdx={idx} key={idx} />
                    ))}
                </ListGroup>

                <Form.Group controlId="vehicle">
                  <Form.Label>
                    {t("pages:trip_editor.select_vehicle")}
                  </Form.Label>
                  <Select
                    options={vehicleList}
                    value={selectedVehicle}
                    onChange={(v) => (v ? setVehicle(v.value!) : null)}
                    placeholder={
                      vehicleList.length === 0
                        ? t("pages:trip_editor.create_vehicle")
                        : t("pages:trip_editor.select_vehicle")
                    }
                    onMenuOpen={() => {
                      if (vehicleList.length > 0) {
                        return;
                      }

                      setCreateVehicleModal(true);
                    }}
                  />
                  {error?.field === "vehicle" && (
                    <Alert variant="danger">{t(error?.message)}</Alert>
                  )}
                </Form.Group>

                <Button
                  disabled={saving || !route}
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
            )}
          </Stack>
        </Form>
      </Container>
    </StandardLayout>
  );
};

export default TripEditor;
