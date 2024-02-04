import { useEffect, useState, useMemo } from "react";
import * as actions from "../../redux/reducers/driver_app";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";

import {
  BsPlayFill,
  BsSkipEndFill,
  BsPauseFill,
  BsSkipStartFill,
  BsSkipForwardFill,
  BsFillExclamationTriangleFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";

import { throttle } from "lodash";
import { useAction, useAppSelector } from "../../store";
import { useRouter } from "next/router";
import { Components } from "../../types/directus";
import { Stack } from "react-bootstrap";
import { GetServerSideProps } from "next/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUser } from "../../util/hooks";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["driverApp"])),
      // Will be passed to the page component as props
    },
  };
};

const DriverApp = () => {
  const router = useRouter();
  const { trip } = router.query;
  const { t } = useTranslation();

  const userId = useUser();

  const [inService, setInService] = useState(false);
  const [announcements, setAnnouncements] = useState(false);
  // const [wakeLock, setWakeLock] = useState(null);

  const [congestionLevel, setCongestionLevel] = useState(null as string | null);

  const updateTrip = useAction(actions.updateTrip);
  const fetchTripData = useAction(actions.fetchTripData);
  const setStopSequence = useAction(actions.setStopSequence);
  const setCurrentLocation = useAction(actions.updateLocation);

  const [voices, setVoices] = useState([] as SpeechSynthesisVoice[]);

  const {
    stop_times,
    stopSequence: currentStopSequence,
    trip_updates,
    distanceToNextStop,
    distanceToNextStopFormatted,
    location,
    nextStop,
  } = useAppSelector((state) => state.driverApp);

  const reportTripStatus = useMemo(
    () =>
      throttle(
        ({
          currentStopSequence: current_stop_sequence,
          congestionLevel: congestion_level,
          location,
        }) => {
          if (trip_updates.length === 0) {
            return;
          }

          if (location) {
            const { latitude: lat, longitude: lon } = location;
            updateTrip({
              id: trip_updates[0].id,
              lat,
              lon,
              // current_stop_sequence,
              // congestion_level,
            });
          }
        },
        3000
      ),
    [trip_updates, updateTrip] // don't add more dependencies or else it will refresh the trottle
  );

  useEffect(() => {
    if (!trip) {
      return;
    }
    fetchTripData(trip as string);
  }, [fetchTripData, trip]);

  useEffect(() => {
    reportTripStatus({
      currentStopSequence,
      congestionLevel,
      location,
    });
  }, [
    reportTripStatus,
    inService,
    currentStopSequence,
    congestionLevel,
    location,
  ]);

  useEffect(() => {
    if (!announcements) {
      return;
    }

    if (!window.speechSynthesis) {
      console.error("No speech synthesis available");
      return;
    }

    const synth = window.speechSynthesis;

    if (!voices) {
      setVoices(synth.getVoices());
    }
    if (synth.speaking) {
      return;
    }

    if (!nextStop || !t) {
      return;
    }

    if (nextStop.stop?.stop_name) {
      const readText = t("driverApp:tts.next_stop", {
        name: nextStop.stop?.tts_stop_name || nextStop.stop?.stop_name,
      });
      const utterance = new SpeechSynthesisUtterance(readText);
      utterance.voice = synth.getVoices()[600];
      synth.speak(utterance);
      console.log("speaking", readText);
    }
  }, [nextStop, t, announcements, voices]);

  const [watchId, setWatchId] = useState(null as number | null);
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    if (!inService && watchId) {
      navigator.geolocation.clearWatch(watchId);
      return;
    }

    if (inService && !watchId) {
      const id = navigator.geolocation.watchPosition(
        setCurrentLocation,
        () => {
          if (watchId) {
            navigator.geolocation.clearWatch(watchId);
          }
          setCurrentLocation(undefined);
        },
        {
          enableHighAccuracy: true,
        }
      );

      setWatchId(id);
      return;
    }
  }, [setCurrentLocation, watchId, inService]);

  // EXPERIMENTAL
  // uncomment for wake lock,  to keep the screen on
  // useEffect(() => {
  //   if (inService) {
  //     if (wakeLock || !navigator.wakeLock) {
  //       return;
  //     }

  //     navigator.wakeLock
  //       .request("screen")
  //       .then((wake) => {
  //         setWakeLock(wake);
  //         wake.addEventListener("release", () => {
  //           setWakeLock(null);
  //         });
  //       })
  //       .catch(console.error);
  //     return;
  //   }

  //   if (!inService) {
  //     if (!wakeLock) {
  //       return;
  //     }
  //     wakeLock
  //       .release()
  //       .then(() => {
  //         setWakeLock(null);
  //       })
  //       .catch(console.error);
  //     return;
  //   }
  // }, [inService, wakeLock, setWakeLock]);

  if (!userId) {
    return null;
  }

  if (trip_updates.length === 0) {
    return (
      <Container fluid>
        <Alert variant="danger">{t("driverApp:no_vehicle")}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Stack gap={3}>
        <h1>{t("driverApp:next_stop")}</h1>
        {nextStop && (
          <Card>
            <Card.Body>
              <h2>{nextStop && nextStop.stop?.stop_name}</h2>
              <p>
                {distanceToNextStop && `in ${distanceToNextStopFormatted} | `}
                {nextStop.arrival || "no arrival time"}
              </p>
            </Card.Body>
          </Card>
        )}
        <ListGroup as="ol">
          {stop_times
            .filter((st) => st.stop_sequence! - 1 > currentStopSequence - 2)
            .map((stopTime) => (
              <ListGroup.Item
                className="d-flex justify-content-between align-items-start"
                as="li"
                key={stopTime.id}
                active={stopTime.stop_sequence! - 1 === currentStopSequence}
                onClick={() => {
                  if (!inService) {
                    return;
                  }
                  setStopSequence(stopTime.stop_sequence! - 1);
                }}
                action
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{stopTime.stop?.stop_name}</div>
                  {stopTime.arrival}
                </div>
                <Badge bg="primary" pill>
                  0
                </Badge>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Stack>

      <Navbar bg="light" expand="lg" fixed="bottom">
        <Container>
          <Row className="justify-content-center">
            {!inService && (
              <Button size="lg" onClick={() => setInService(true)}>
                <BsPlayFill />
                {t("driverApp:start_service")}
              </Button>
            )}
            {inService && (
              <ListGroup horizontal>
                <ListGroup.Item
                  action
                  onClick={() => setStopSequence(currentStopSequence - 1)}
                >
                  <BsSkipStartFill aria-label={t("driverApp:previous_stop")} />
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => setInService(false)}>
                  <BsPauseFill aria-label={t("driverApp:pause_service")} />
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => setStopSequence(currentStopSequence + 1)}
                >
                  <BsSkipEndFill aria-label={t("driverApp:next_stop")} />
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => setStopSequence(currentStopSequence + 1)}
                >
                  <BsSkipForwardFill
                    aria-label={t("driverApp:cancel_next_stop")}
                  />
                </ListGroup.Item>

                <ListGroup.Item action>
                  <Dropdown drop="up">
                    <Dropdown.Toggle id="dropdown-custom-components">
                      <BsFillExclamationTriangleFill
                        aria-label={t("driverApp:report_congestion")}
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {[
                        "RUNNING_SMOOTHLY",
                        "STOP_AND_GO",
                        "CONGESTION",
                        "SEVERE_CONGESTION",
                      ].map((val, idx) => (
                        <Dropdown.Item
                          eventKey={idx}
                          key={idx}
                          onClick={() => setCongestionLevel(val)}
                        >
                          {t(`driverApp:congestion_level.${val}`)}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={announcements}
                  onClick={() => setAnnouncements(!announcements)}
                >
                  <BsFillVolumeUpFill
                    aria-label={t("driverApp:announcements")}
                  />
                </ListGroup.Item>
              </ListGroup>
            )}
          </Row>
        </Container>
      </Navbar>
    </Container>
  );
};

export default DriverApp;
