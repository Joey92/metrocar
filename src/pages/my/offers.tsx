import React, { useEffect, useMemo } from "react";
import Trip from "../../components/Trip";
import * as actions from "../../redux/reducers/trip";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";

import { BsThreeDotsVertical } from "react-icons/bs";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "next-i18next";
import { useAction, useAppSelector } from "../../store";
import StandardLayout from "../../components/layouts/Standard";

import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUser } from "../../util/hooks";
import { Components } from "../../types/directus";
import { Stack } from "react-bootstrap";
import { DateTime } from "luxon";
import Head from "next/head";
import Link from "next/link";
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", [
        "common",
        "pages",
        "trip",
      ])),
      // Will be passed to the page component as props
    },
  };
};

interface TripRender {
  upcoming: Components.Schemas.ItemsTrips[];
  past: Components.Schemas.ItemsTrips[];
}

const TripList: NextPage = () => {
  useUser();
  const { t } = useTranslation();

  const { trips, loading, tripLoading } = useAppSelector((state) => state.trip);

  const fetchTrips = useAction(actions.fetchTrips);
  const cancelTrip = useAction(actions.cancelTrip);
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const tripList = Object.values(trips) as Components.Schemas.ItemsTrips[];

  const renderTrips = useMemo(() => {
    const now = DateTime.now();
    return tripList.reduce(
      (acc, trip) => {
        if (!trip.start_date) {
          return acc;
        }

        const startDate = DateTime.fromISO(trip.start_date);

        if (startDate.plus({ day: 1 }).startOf("day") < now.startOf("day")) {
          acc.past.push(trip);
          return acc;
        }

        acc.upcoming.push(trip);
        return acc;
      },
      {
        upcoming: [],
        past: [],
      } as TripRender
    );
  }, [tripList]);

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:offers.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:offers.head.title")}
          key="title"
        />
      </Head>
      <Container className="trips">
        {loading && <Spinner animation="border" />}
        {!loading && tripList.length === 0 && <h1>{t("trip:no_trips_yet")}</h1>}

        {Object.keys(renderTrips).map((key) => {
          const trips = renderTrips[key as keyof TripRender];

          if (trips.length === 0) {
            return;
          }

          return (
            <>
              <h1>{t(`pages:offers.headings.${key}`)}</h1>
              <Stack gap={3}>
                {trips.map((trip) => {
                  const stopTimes = [...trip.stop_times!].sort(
                    (a, b) => a.stop_sequence! - b.stop_sequence!
                  );
                  const { hour, minute } = DateTime.fromISO(
                    stopTimes![0].departure!
                  );
                  const tripStartDate = DateTime.fromISO(trip.start_date!).set({
                    hour,
                    minute,
                  });
                  return (
                    <Card key={trip.id}>
                      <Card.Header>
                        <Stack direction="horizontal">
                          <>
                            {tripLoading === trip.id && (
                              <Spinner animation="border" />
                            )}
                            <span
                              title={tripStartDate.toLocaleString(
                                DateTime.DATETIME_SHORT
                              )}
                            >
                              {tripStartDate.toRelative()}
                            </span>
                          </>
                          <Dropdown className="ms-auto">
                            <Dropdown.Toggle
                              as={BsThreeDotsVertical}
                              variant="success"
                              id="dropdown-basic"
                            />

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => cancelTrip(trip.id!)}
                                // todo: find a way
                                // disabled={!!trip.schedule_relationship}
                              >
                                {t("trip:cancel_trip")}
                              </Dropdown.Item>

                              {trip.feature_driver_app && (
                                <Link href={`/driver/${trip.id!}`} passHref>
                                  <Dropdown.Item>
                                    {t("trip:drive_now")}
                                  </Dropdown.Item>
                                </Link>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        </Stack>
                      </Card.Header>

                      <Card.Body style={{ padding: ".75rem" }}>
                        <Trip {...trip}></Trip>
                      </Card.Body>
                    </Card>
                  );
                })}
              </Stack>
              <hr />
            </>
          );
        })}
      </Container>
    </StandardLayout>
  );
};

export default TripList;
