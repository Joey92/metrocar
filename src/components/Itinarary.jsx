import { MdDirectionsWalk, MdDirectionsCar } from "react-icons/md";
import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";

import { MdAirlineSeatLegroomNormal, MdHail } from "react-icons/md";
import Collapse from "react-bootstrap/Collapse";
import Badge from "react-bootstrap/Badge";
import RouteBadge from "./RouteBadge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import css from "./Itinarary.module.scss";

import {
  BsFillPatchCheckFill,
  BsEnvelopeFill,
  BsChevronDown,
  BsChevronUp,
  BsCheck,
} from "react-icons/bs";

import { FaExternalLinkAlt } from "react-icons/fa";

import { DateTime } from "luxon";

import { ticketRequest } from "../redux/reducers/user";
import { useDispatch } from "react-redux";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
const colorPalette = ["#E56399", "#E5D4CE", "#DE6E4B", "#7FD1B9", "#7A6563"];
export const PassengerMatrix = ({ maxSeats = 3, tickets, stopTimes }) => {
  const { t } = useTranslation();

  const seatOccupier = useMemo(() => {
    // Get all passenger occupation per station
    // this gives us an array with how many passenger
    // are with us at each station
    const passengerLegs = tickets.reduce(
      (occupations, passenger, ticketIdx) => {
        for (
          let station = passenger.origin_stop_sequence - 1;
          station <= passenger.destination_stop_sequence - 1;
          station++
        ) {
          occupations[station][ticketIdx] = {
            ...passenger,
            idx: ticketIdx,
          };
        }

        return occupations;
      },
      Array.from({ length: stopTimes.length }).map(() =>
        Array.from({ length: maxSeats }).map(() => undefined)
      )
    );

    // Shuffle the passengers to maximise seat utilisation
    // also transform into segments
    return passengerLegs.reduce(
      (s, passengers, stopIdx) => {
        if (stopIdx === 0) {
          // don't modify the first stop
          s[0] = s[0].map((passenger) => [undefined, passenger]);
          return s;
        }

        // get seat configuration of previous stop
        const prevSeats = s[stopIdx - 1];

        passengers.forEach((passenger, slotIdx) => {
          if (!passenger) {
            return;
          }

          const seatInUse = prevSeats.findIndex((prev) => {
            if (!prev) {
              return false;
            }

            const seat = prev[1];

            if (!seat) {
              return false;
            }

            return (
              seat.id === passenger.id || // either we take the same seat as we were before
              seat.destination_stop_sequence === passenger.origin_stop_sequence // or our new passenger gets a seats of someone leaving
            );
          });

          // No seat was abe to be allocated again, assign new seat
          if (seatInUse < 0) {
            // assign next best already empty seat
            const newSeat = prevSeats.findIndex((prev) => !prev || !prev[1]);

            // free up our old spot
            s[stopIdx][slotIdx] = [undefined, undefined];
            // move to our new spot
            s[stopIdx][newSeat] = [undefined, passenger];
            return;
          }

          // free up our old spot
          s[stopIdx][slotIdx] = [undefined, undefined];

          // move to our new spot
          if (stopIdx === s.length - 1) {
            // we're at the last stop
            s[stopIdx][seatInUse] = [passenger, undefined];
            return;
          }

          // move to our new spot
          s[stopIdx][seatInUse] = [prevSeats[seatInUse][1], passenger];
        });
        return s;
      },
      [...passengerLegs.map((x) => [...x])]
    );
  }, [tickets, maxSeats, stopTimes]);

  const amountUnseated = useMemo(
    () =>
      seatOccupier.reduce(
        (amount, occupiers) =>
          occupiers.length > amount ? occupiers.length : amount,
        0
      ) - maxSeats,
    [seatOccupier, maxSeats]
  );

  if (!tickets) {
    return null;
  }

  return (
    <table className="passenger-matrix">
      <thead>
        <tr className={css.entry}>
          <td style={{ padding: ".75rem" }}>
            {t("trip:passenger_matrix.station_name")}
          </td>
          {Array.from({ length: maxSeats }).map((_, idx) => (
            <td style={{ padding: ".75rem" }} key={idx}>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip>
                    {t("trip:passenger_matrix.passenger_has_space")}
                  </Tooltip>
                }
              >
                <div>
                  <MdAirlineSeatLegroomNormal />
                </div>
              </OverlayTrigger>
            </td>
          ))}
          {Array.from({
            length: amountUnseated,
          }).map((_, idx) => (
            <td style={{ padding: ".75rem" }} key={idx}>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip>
                    {t("trip:passenger_matrix.passenger_has_no_space")}
                  </Tooltip>
                }
              >
                <div>
                  <MdHail />
                </div>
              </OverlayTrigger>
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {seatOccupier.map((seats, stopIdx) => (
          <tr className={css.entry} key={stopIdx}>
            <td style={{ padding: ".75rem" }}>
              {stopTimes[stopIdx].stop.stop_name}
            </td>
            {seats.map((seatExchange, seatIdx) => {
              if (!seatExchange) {
                return <td key={seatIdx}></td>;
              }

              return (
                <td key={seatIdx}>
                  {seatExchange.map((ticket, ticketIdx) => {
                    if (!ticket) {
                      return <div key={ticketIdx}></div>;
                    }
                    return (
                      <div
                        key={ticketIdx}
                        className={!ticket.approved ? css.newRider : ""}
                        style={{
                          backgroundColor: `${
                            seatIdx > maxSeats - 1
                              ? "red"
                              : colorPalette[ticket.idx % colorPalette.length]
                          }`,
                        }}
                      ></div>
                    );
                  })}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const InternalInitiarary = ({
  stopTimes,
  route,
  // display only a subset of stop times
  minStopSequence = 0,
  maxStopSequence = 10000,
}) => {
  const { t } = useTranslation();
  const filteredStopTimes = useMemo(
    () =>
      stopTimes
        .filter(
          (st) =>
            st.stop_sequence >= minStopSequence &&
            st.stop_sequence <= maxStopSequence
        )
        .sort((a, b) => a.stop_sequence - b.stop_sequence),
    [stopTimes, minStopSequence, maxStopSequence]
  );

  return (
    <div>
      {minStopSequence > 1 && (
        <div className={css.legContainer}>
          <div className={css.lineContainer}>
            <div
              className={`${css.line} ${css.walk}`}
              style={{
                borderColor: route.route_color,
              }}
            ></div>
          </div>
          <div className={css.dataContainer} style={{ height: "2rem" }}></div>
        </div>
      )}

      {filteredStopTimes.map((st, idx) => (
        <div className={css.legContainer} key={idx}>
          <div className={css.lineContainer}>
            <div
              className={`${css.line} 
              ${maxStopSequence === st.stop_sequence ? css.walk : ""}
              ${st.stop_sequence === stopTimes.length ? css.end : ""}`}
              style={{
                borderColor: route.route_color,
              }}
            ></div>
          </div>
          <div className={css.dataContainer}>
            <div key={idx}>
              <div className={css.lineMarker}></div>
              <h2>
                {st.stop.stop_name}{" "}
                {(st.stop.id || st.stop.stop_url) && (
                  <Link href={st.stop.stop_url || `/stops/${st.stop.id}`}>
                    <FaExternalLinkAlt style={{ cursor: "pointer" }} />
                  </Link>
                )}
              </h2>
              <div>
                {st.stop_sequence === filteredStopTimes.length ? (
                  <>
                    {st.arrival} {t("trip:itinarary.arrival_time")}
                  </>
                ) : (
                  <>
                    {st.departure} {t("trip:itinarary.departure_time")}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const timeFormat = "HH:mm";

/**
 * This one is meant to display the itinarary of an OTP response
 */
export const ExternalInitiarary = ({
  legs,
  itinaryFeatures,
  currentUserId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return legs.map((leg, legIdx) => (
    <div key={legIdx}>
      <div className={css.legContainer}>
        <div className={css.lineContainer}>
          <div
            className={`${css.line} ${leg.mode === "WALK" ? css.walk : ""}`}
            style={{
              borderColor: leg.routeColor,
            }}
          ></div>
        </div>
        <div className={css.dataContainer}>
          <div className={css.lineMarker}>
            {leg.mode === "WALK" ? <MdDirectionsWalk /> : null}
            {leg.mode === "BUS" ? <MdDirectionsCar /> : null}
          </div>
          <h2>
            <Stack direction="horizontal" gap={3}>
              {leg.from.name}
              {leg.from.stopId?.startsWith("MetroCar:") && (
                <Link
                  href={`/stops/${leg.from.stopId.replace("MetroCar:", "")}`}
                >
                  <FaExternalLinkAlt style={{ cursor: "pointer" }} />
                </Link>
              )}
            </Stack>
          </h2>
          <div>
            {DateTime.fromMillis(leg.from.departure).toFormat(timeFormat)}
          </div>
          {leg.trip_id && ( // only display trip info if it's actually a transit leg
            <p>
              <RouteBadge
                name={leg.routeShortName}
                color={leg.routeColor}
                textColor={leg.routeTextColor}
                href={
                  leg.routeId.startsWith("MetroCar:")
                    ? `/routes/${leg.routeId.replace("MetroCar:", "")}`
                    : undefined
                }
              />{" "}
              <ReactMarkdown>
                {t("pages:search.trip_offered_by", leg)}
              </ReactMarkdown>
              {itinaryFeatures[legIdx].tickets &&
                leg.tickets &&
                leg.tickets
                  .filter(
                    // filter out tickets that are not for exactly this trip, start date and stop sequences
                    (ticket) =>
                      ticket.origin_stop_sequence === leg.from.stopSequence &&
                      ticket.destination_stop_sequence ===
                        leg.to.stopSequence &&
                      ticket.start_date === leg.start_date
                  )
                  .map(({ approved }) =>
                    approved ? (
                      <OverlayTrigger
                        placement={"top"}
                        overlay={
                          <Tooltip>
                            {t("pages:search.booking.confirmed.tooltip")}
                          </Tooltip>
                        }
                      >
                        <Badge bg="success">
                          <BsFillPatchCheckFill />{" "}
                          {t("pages:search.booking.confirmed.label")}
                        </Badge>
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger
                        placement={"top"}
                        overlay={
                          <Tooltip>
                            {t("pages:search.booking.pending.tooltip")}
                          </Tooltip>
                        }
                      >
                        <Badge bg="info">
                          <BsEnvelopeFill />{" "}
                          {t("pages:search.booking.pending.label")}
                        </Badge>
                      </OverlayTrigger>
                    )
                  )}
            </p>
          )}

          {itinaryFeatures[legIdx].tickets && !currentUserId && (
            <Link href="/register" passHref>
              <Button variant="primary">
                {t("pages:search.request_seat")}
              </Button>
            </Link>
          )}

          {itinaryFeatures[legIdx].tickets &&
            currentUserId &&
            leg.owner_id !== currentUserId &&
            leg.tickets.length === 0 && (
              <Button
                variant={requestSent ? "success" : "primary"}
                disabled={requestSent}
                onClick={() => {
                  dispatch(
                    ticketRequest({
                      trip: leg.trip_id,
                      start_date: leg.start_date,
                      origin_stop_sequence: leg.from.stopSequence,
                      destination_stop_sequence: leg.to.stopSequence,
                    })
                  );
                  setRequestSent(true);
                }}
              >
                {requestSent ? (
                  <>
                    <BsCheck /> {t("pages:search.request_seat_sent")}
                  </>
                ) : (
                  t("pages:search.request_seat")
                )}
              </Button>
            )}

          {leg.intermediateStops.length > 0 && (
            <div>
              {!expanded && (
                <div
                  onClick={() => setExpanded(!expanded)}
                  className={css.lineMarker}
                >
                  ...
                </div>
              )}
              <p onClick={() => setExpanded(!expanded)}>
                {expanded ? <BsChevronUp /> : <BsChevronDown />}{" "}
                {t("pages:search.ride_x_amount_of_stops", {
                  amount: leg.intermediateStops.length,
                })}
              </p>
            </div>
          )}
        </div>
      </div>
      <Collapse in={expanded}>
        <div>
          {leg.intermediateStops.map((stop, idx) => (
            <div className={css.legContainer} key={idx}>
              <div className={css.lineContainer}>
                <div
                  className={`${css.line} ${
                    leg.mode === "WALK" ? css.walk : ""
                  }`}
                  style={{
                    borderColor: leg.routeColor,
                  }}
                ></div>
              </div>
              <div className={css.dataContainer}>
                <div key={idx}>
                  <div className={css.lineMarker}></div>
                  <h2>
                    {stop.name}{" "}
                    {stop.stopId.startsWith("MetroCar:") && (
                      <Link
                        href={`/stops/${stop.stopId.replace("MetroCar:", "")}`}
                      >
                        <FaExternalLinkAlt style={{ cursor: "pointer" }} />
                      </Link>
                    )}
                  </h2>
                  <div>
                    {DateTime.fromMillis(stop.departure).toFormat(timeFormat)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Collapse>

      {legs.length - 1 === legIdx && (
        <div className={css.legContainer} key={legIdx}>
          <div className={css.lineContainer}>
            <div
              className={`${css.line} ${leg.mode === "WALK" ? css.walk : ""} ${
                legs.length - 1 === legIdx ? css.end : ""
              }`}
              style={{
                borderColor: leg.routeColor,
              }}
            ></div>
          </div>
          <div className={css.dataContainer}>
            <div className={css.lineMarker}></div>
            <h2>{leg.to.name}</h2>
            <div>
              {DateTime.fromMillis(leg.to.arrival).toFormat(timeFormat)}
            </div>
          </div>
        </div>
      )}
    </div>
  ));
};

export default InternalInitiarary;
