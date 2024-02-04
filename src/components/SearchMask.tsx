import React, { useState, useEffect } from "react";
import * as actions from "../redux/reducers/search";
import { DateTime } from "luxon";
// @ts-ignore: missing @types.. but they are actually there?
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAction, useAppSelector } from "../store";
import { Row, Col, Placeholder, Stack, Card } from "react-bootstrap";
import { BsArrowDownUp } from "react-icons/bs";
import GeolocationAsyncSelect from "./GeolocationAsyncSelect";

export const SearchMaskPlaceholder = () => (
  <Card>
    <Card.Body>
      <Row>
        <Stack direction="horizontal" gap={1}>
          <Stack gap={2}>
            <Placeholder size="lg" style={{ minWidth: "20rem" }} />
            <Placeholder size="lg" />
          </Stack>
          <BsArrowDownUp style={{ fontSize: "1.5rem", cursor: "pointer" }} />
        </Stack>
      </Row>

      <Row>
        <Placeholder
          as={Col}
          controlId="time"
          style={{ marginBottom: ".75rem" }}
        ></Placeholder>
        <Col>
          <Placeholder.Button
            style={{ minWidth: "10rem" }}
            size="lg"
          ></Placeholder.Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

const SearchMask = ({ onSubmit = () => null }) => {
  const { t } = useTranslation();

  const router = useRouter();

  const { location } = useAppSelector((state) => state.user);
  const [explicitlyShowFrom, setExplicitlyShowFrom] = useState(false);
  const [showFromField, setShowFromField] = useState(false);

  const setFrom = useAction(actions.setFrom);
  const setTo = useAction(actions.setTo);
  const setFieldToCurrentLocation = useAction(
    actions.setFieldToCurrentLocation
  );
  const setDate = useAction(actions.setDate);
  const searchTrip = useAction(actions.searchTrip);
  const flip = useAction(actions.flipFromTo);

  useEffect(() => {
    if (explicitlyShowFrom || !location) {
      setShowFromField(true);
      return;
    }

    setShowFromField(false);
    setFieldToCurrentLocation("from");
  }, [location, explicitlyShowFrom, setFrom, setFieldToCurrentLocation]);

  const { error, from, to, date, loading, defaultOptions } = useAppSelector(
    (state) => state.search
  );

  return (
    <Card>
      <Card.Body>
        <Row>
          <Stack direction="horizontal" gap={1}>
            <Stack gap={2}>
              {showFromField && (
                <Form.Group controlId="departureFrom">
                  <GeolocationAsyncSelect
                    placeholder={t("pages:search.origin.label")}
                    value={from}
                    onChange={(val) => setFrom(val)}
                  />

                  {error?.field === "from" && <span>{t(error?.message)}</span>}
                </Form.Group>
              )}

              <Form.Group controlId="arrivalAt">
                <GeolocationAsyncSelect
                  placeholder={t("pages:search.destination.label")}
                  value={to}
                  onChange={setTo}
                />
                {error?.field === "to" && <span>{t(error?.message)}</span>}
              </Form.Group>

              {!showFromField && !explicitlyShowFrom && (
                <span onClick={() => setExplicitlyShowFrom(true)}>
                  {t("pages:search.show_from_field")}
                </span>
              )}
            </Stack>
            {showFromField && (
              <BsArrowDownUp
                onClick={() => flip()}
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
              />
            )}
          </Stack>
        </Row>

        <Row>
          <Form.Group
            as={Col}
            controlId="time"
            style={{ marginBottom: ".75rem" }}
          >
            <DateTimePicker
              className="form-control"
              disableClock
              value={DateTime.fromMillis(date).toJSDate()}
              minDate={new Date()}
              onChange={(d: Date) => setDate(d.getTime())}
            />
          </Form.Group>
          <Col>
            <Button
              size="lg"
              onClick={() => {
                searchTrip();
                onSubmit();

                if (!from || !to || !date) {
                  return;
                }
                const dateTime = DateTime.fromMillis(date);
                const { value: fromCoords, label: fromName } = from;
                const { value: toCoords, label: toName } = to;
                router.replace({
                  pathname: "/search",
                  search:
                    "?" +
                    new URLSearchParams({
                      from: fromCoords! as unknown as string, // sorry for this loool
                      to: toCoords! as unknown as string,
                      fromName: fromName!,
                      toName: toName!,
                      date: dateTime.toISO(),
                    }),
                });
              }}
              disabled={loading}
              variant="primary"
            >
              {loading ? <Spinner animation="border" /> : t("search")}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SearchMask;
