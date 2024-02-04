import React, { useCallback, useEffect, useMemo, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import * as actions from "../redux/reducers/search";

import { DateTime } from "luxon";
import { useTranslation } from "next-i18next";
import SearchMask from "../components/SearchMask";
import Link from "next/link";

import { GetStaticProps, NextPage } from "next";
import { useAppDispatch, useAppSelector } from "../store";

import StandardLayout from "../components/layouts/Standard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import SearchResults from "../components/SearchResults";
import { Button, Stack } from "react-bootstrap";
import api from "../services/directus";
import { BsCheckLg, BsSearch, BsX } from "react-icons/bs";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const Search: NextPage = () => {
  const { id: userId } = useAppSelector((state) => state.user);
  const { itineraries, error, searched, from, to, date } = useAppSelector(
    (state) => state.search
  );
  const [selected, setSelectedItinerary] = useState(0);
  const [radarCreated, setRadarCreated] = useState(null as boolean | null);

  const { t } = useTranslation();

  const Map = React.useMemo(
    () =>
      dynamic(
        () => import("../components/maps/SeachMap"), // replace '@components/map' with your component's location
        {
          loading: () => <p>Map is Loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [
      /* list variables which should trigger a re-render here */
    ]
  );

  const router = useRouter();

  const dispatch = useAppDispatch();
  const dispatchSearch = useCallback(
    (
      dateQuery: string,
      fromQuery: string,
      fromName: string,
      toQuery: string,
      toName: string
    ) =>
      dispatch(async (dispatch) => {
        const searchDate = DateTime.fromISO(dateQuery as string);

        await dispatch(
          actions.setFrom({
            value: (fromQuery as string).split(",").map(parseFloat) as [
              number,
              number
            ],
            label: fromName as string,
          })
        );

        await dispatch(
          actions.setTo({
            value: (toQuery as string).split(",").map(parseFloat) as [
              number,
              number
            ],
            label: toName as string,
          })
        );
        await dispatch(actions.setDate(searchDate.toMillis()));
        await dispatch(actions.searchTrip());
      }),
    [dispatch]
  );

  // prefill form from query values and search
  useEffect(() => {
    if (searched) {
      return;
    }

    const {
      from: fromQuery,
      to: toQuery,
      fromName,
      toName,
      date: dateQuery,
    } = router.query;

    if (!fromQuery || !toQuery || !dateQuery) {
      return;
    }

    dispatchSearch(
      dateQuery as string,
      fromQuery as string,
      fromName as string,
      toQuery as string,
      toName as string
    );
  }, [searched, dispatchSearch, router]);

  const createRadar = useMemo(
    () => () =>
      api
        .post("/items/trip_radar", {
          from: from
            ? {
                type: "Point",
                coordinates: from.value,
              }
            : undefined,
          to: to
            ? {
                type: "Point",
                coordinates: to.value,
              }
            : undefined,
          from_name: from?.label,
          to_name: to?.label,
          date: DateTime.fromMillis(date).toISO(),
        })

        .then(() => {
          setRadarCreated(true);
        })
        .catch(() => {
          setRadarCreated(false);
        }),
    [from, to, date]
  );

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:search.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:search.head.title")}
          key="title"
        />
      </Head>
      <Stack gap={3}>
        <Stack direction="horizontal" className="justify-content-center">
          <SearchMask />
        </Stack>

        {error && !error.field && (
          <Row xs="auto" className="justify-content-md-center">
            <Alert variant="danger">{error.message}</Alert>
          </Row>
        )}

        {itineraries !== null && (
          <>
            {itineraries.length === 0 && (
              <>
                <Row xs="auto" className="justify-content-md-center">
                  <Col>
                    <h1>{t("pages:search.no_result")}</h1>
                  </Col>
                </Row>

                <Row xs="auto" className="justify-content-md-center">
                  <Col>
                    <Link href={userId ? "/trip/create" : "/register"}>
                      <Button>{t("pages:search.create_trip_link_text")}</Button>
                    </Link>
                  </Col>
                  <Col>{t("pages:search.or")}</Col>

                  <Col>
                    {userId ? (
                      <Button
                        onClick={createRadar}
                        disabled={radarCreated !== null}
                        variant={
                          radarCreated === null
                            ? "primary"
                            : radarCreated
                            ? "success"
                            : "danger"
                        }
                      >
                        {radarCreated && (
                          <>
                            <BsCheckLg />{" "}
                            {t("pages:search.create_trip_radar_text_created")}
                          </>
                        )}

                        {radarCreated === null && (
                          <>
                            <BsSearch />{" "}
                            {t("pages:search.create_trip_radar_text")}
                          </>
                        )}

                        {radarCreated === false && (
                          <>
                            <BsX />{" "}
                            {t("pages:search.create_trip_radar_text_error")}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Link href="/register">
                        <Button>
                          <BsSearch></BsSearch>{" "}
                          {t("pages:search.create_trip_radar_text")}
                        </Button>
                      </Link>
                    )}
                  </Col>
                </Row>
              </>
            )}
            {itineraries.length > 0 && (
              <>
                <Map itinerary={itineraries[selected]} />

                <SearchResults
                  itineraries={itineraries}
                  onSelectItinerary={setSelectedItinerary}
                  currentUserId={userId}
                />
              </>
            )}
          </>
        )}
      </Stack>
    </StandardLayout>
  );
};

export default Search;
