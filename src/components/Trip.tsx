import React, { useMemo } from "react";
import { DateTime } from "luxon";
import ListGroup from "react-bootstrap/ListGroup";

import Accordion from "react-bootstrap/Accordion";
import RouteBadge from "./RouteBadge";
import { useTranslation, Trans } from "next-i18next";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { ticketEdit } from "../redux/reducers/trip";
import Itinarary, { PassengerMatrix } from "./Itinarary";
import { useAppDispatch } from "../store";
import { Components } from "../types/directus";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatStopTimes } from "../util/stop_times";

type TripProps = Components.Schemas.ItemsTrips & {
  tickets?: Components.Schemas.ItemsTickets[] | null;

  // filter stop times in the itinarary by providing a range
  minStopSequence?: number;
  maxStopSequence?: number;
};

type DenyReason = "FULLY_BOOKED" | "CANCELED_TRIP";
const denyChoices: DenyReason[] = ["FULLY_BOOKED", "CANCELED_TRIP"];

const Trip = (props: TripProps) => {
  const {
    calendar,
    route,
    start_date,
    trip_short_name: destination,

    stop_times = [] as Components.Schemas.ItemsStopTimes[],
    trip_updates = [] as Components.Schemas.ItemsRtTripUpdates[],
    tickets = [] as Components.Schemas.ItemsTickets[],

    // filter stop times in the itinarary by providing a range
    minStopSequence = 0,
    maxStopSequence = 10000,
  } = props;
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const ticketRequests = useMemo(
    () =>
      tickets?.filter(
        (ticket) => ticket.approved === null && !ticket.deny_reason
      ),
    [tickets]
  );

  const passengerMatrixTickets = useMemo(
    () =>
      tickets?.filter(
        // only render approved and not-approved-yet tickets
        // denied tickets  should be filtered out from the passenger matrix
        (ticket) => ticket.approved !== false && !ticket.deny_reason
      ),
    [tickets]
  );

  const stopNames = useMemo(
    () =>
      stop_times?.map(
        (stopTime) => (stopTime.stop as Components.Schemas.ItemsStops).stop_name
      ) || [],
    [stop_times]
  );

  const isCanceled = useMemo(
    () =>
      trip_updates?.find(
        (tu) =>
          (tu as Components.Schemas.ItemsRtTripUpdates)
            .schedule_relationship === "CANCELED"
      ),
    [trip_updates]
  );

  return (
    <div className="trip">
      <h1>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip>Every trip is assigned a line number.</Tooltip>}
        >
          <RouteBadge
            name={route?.route_short_name || "error"}
            color={route?.route_color || "error"}
            textColor={route?.route_text_color || "error"}
            href={route?.id ? `/routes/${route?.id}` : undefined}
          />
        </OverlayTrigger>{" "}
        {t("trip:title", { destination })}
        {isCanceled && (
          <Badge bg="danger">{t(`trip:schedule_relationship.CANCELED`)}</Badge>
        )}
      </h1>

      {calendar && (
        <ListGroup horizontal>
          {(
            [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ] as (keyof Components.Schemas.ItemsCalendar)[]
          ).map((day) => (
            <ListGroup.Item
              key={day}
              type="checkbox"
              variant={calendar[day] ? "primary" : "secondary"}
            >
              {t(`day.${day}`)}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Row>
        {ticketRequests?.map((ticket) => (
          <Col xs="auto" key={ticket.id}>
            <Card style={{ width: "18rem", margin: ".75rem" }}>
              <Card.Body>
                <Card.Title>
                  {t("pages:trip.ticket_request.title", {
                    username: ticket.owner!.display_name,
                  })}
                </Card.Title>
                <Card.Text>
                  {t("pages:trip.ticket_request.text", {
                    origin: stopNames[ticket.origin_stop_sequence! - 1],
                    destination:
                      stopNames[ticket.destination_stop_sequence! - 1],
                  })}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <ButtonGroup>
                  <Button
                    variant="success"
                    onClick={() =>
                      dispatch(ticketEdit({ id: ticket.id!, approved: true }))
                    }
                  >
                    {t("pages:trip.ticket_request.approve")}
                  </Button>
                  <DropdownButton
                    as={ButtonGroup}
                    title={t("pages:trip.ticket_request.deny_with_reason")}
                  >
                    {denyChoices.map((deny_reason, idx) => (
                      <Dropdown.Item
                        eventKey={idx}
                        key={idx}
                        onClick={() =>
                          dispatch(
                            ticketEdit({
                              id: ticket.id!,
                              deny_reason,
                            })
                          )
                        }
                      >
                        {t(`pages:search.booking.deny_reason.${deny_reason}`)}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </ButtonGroup>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      {passengerMatrixTickets && passengerMatrixTickets.length > 0 && (
        <>
          <h1>{t(`trip:your_passengers`)}</h1>
          <PassengerMatrix
            tickets={passengerMatrixTickets}
            stopTimes={stop_times}
          />
        </>
      )}
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t(`trip:view_schedule`)}</Accordion.Header>
          <Accordion.Body>
            <Itinarary
              stopTimes={formatStopTimes(stop_times || [])}
              route={route}
              minStopSequence={minStopSequence}
              maxStopSequence={maxStopSequence}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Trip;
