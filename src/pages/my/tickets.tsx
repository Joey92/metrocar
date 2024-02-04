import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import api from "../../services/directus";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Badge from "react-bootstrap/Badge";
import { Components, DirectusResponse } from "../../types/directus";

import ReactMarkdown from "react-markdown";

import {
  BsFillPatchCheckFill,
  BsEnvelopeFill,
  BsFillCalendarXFill,
} from "react-icons/bs";

import { useTranslation } from "next-i18next";
import Itinarary from "../../components/Itinarary";
import { AxiosError } from "axios";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../components/layouts/Standard";
import { DateTime } from "luxon";
import { formatStopTimes } from "../../util/stop_times";
import { useUser } from "../../util/hooks";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", [
        "common",
        "pages",
        "trip",
      ])),
    },
  };
};

const TicketsView = () => {
  const [tickets, setTickets] = useState(
    [] as Components.Schemas.ItemsTickets[]
  );
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(
    undefined as undefined | { message: string }[]
  );

  const id = useUser();

  useEffect(() => {
    api
      .get<DirectusResponse<Components.Schemas.ItemsTickets[]>>(
        "/items/tickets",
        {
          params: {
            filter: {
              owner: {
                id: {
                  _eq: "$CURRENT_USER",
                },
              },
            },
            fields: [
              "id",
              "origin_stop_sequence",
              "destination_stop_sequence",
              "approved",
              "deny_reason",
              "trip.id",
              "trip.start_date",
              "trip.route.*",
              "trip.trip_updates.*",
              "trip.stop_times.stop_sequence",
              "trip.stop_times.arrival",
              "trip.stop_times.departure",
              "trip.stop_times.stop.id",
              "trip.stop_times.stop.stop_name",
            ],
          },
        }
      )
      .then((resp) => {
        if (resp.data.data) {
          setTickets(resp.data.data);
        }
      })
      .catch((e) => {
        if (e instanceof AxiosError) {
          setErrors(e.request.errors);
        }
      })
      .finally(() => setLoading(false));
  }, [setErrors, id]);

  const { t } = useTranslation();

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:tickets_view.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:tickets_view.head.title")}
          key="title"
        />
      </Head>
      <Container>
        {loading && <Spinner animation="border" />}
        {errors && (
          <Alert>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error.message}</li>
              ))}
            </ul>
          </Alert>
        )}

        {!loading && tickets.length === 0 && (
          <ReactMarkdown>{t("pages:tickets_view.no_tickets")}</ReactMarkdown>
        )}

        {tickets &&
          tickets.map((ticket) => {
            const trip = ticket.trip as Components.Schemas.ItemsTrips;
            return (
              <Card style={{ marginTop: ".75rem" }} key={ticket.id}>
                <Card.Header>
                  {ticket.approved && (
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
                  )}

                  {!ticket.approved && !ticket.deny_reason && (
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
                  )}

                  {!ticket.approved && ticket.deny_reason && (
                    <OverlayTrigger
                      placement={"top"}
                      overlay={
                        <Tooltip>
                          {t("pages:search.booking.denied.tooltip", {
                            reason: t(
                              `pages:search.booking.deny_reason.${ticket.deny_reason}`
                            ),
                          })}
                        </Tooltip>
                      }
                    >
                      <Badge bg="danger">
                        <BsFillCalendarXFill />{" "}
                        {t("pages:search.booking.denied.label", {
                          reason: t(
                            `pages:search.booking.deny_reason.${ticket.deny_reason}`
                          ),
                        })}
                      </Badge>
                    </OverlayTrigger>
                  )}
                </Card.Header>
                <Card.Body>
                  Your trip on{" "}
                  {DateTime.fromSQL(trip.start_date!).toLocaleString(
                    DateTime.DATE_SHORT
                  )}
                  <Itinarary
                    stopTimes={formatStopTimes(trip.stop_times!)}
                    route={trip.route}
                    minStopSequence={ticket.origin_stop_sequence!}
                    maxStopSequence={ticket.destination_stop_sequence!}
                  />
                </Card.Body>
              </Card>
            );
          })}
      </Container>
    </StandardLayout>
  );
};

export default TicketsView;
