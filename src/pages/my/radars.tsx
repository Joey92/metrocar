import React, { useEffect, useState } from "react";
import {
  Container,
  Spinner,
  Alert,
  Card,
  Button,
  Stack,
  CloseButton,
} from "react-bootstrap";
import api from "../../services/directus";
import { DirectusResponse } from "../../types/directus";

import ReactMarkdown from "react-markdown";

import { useTranslation } from "next-i18next";
import { AxiosError } from "axios";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../components/layouts/Standard";

import { useUser } from "../../util/hooks";
import { Radar } from "../../types/types";
import { reduceIdsToObject } from "../../util";
import Link from "next/link";
import { DateTime } from "luxon";
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

const RadarsView = () => {
  const [radars, setRadars] = useState({} as Record<string, Radar>);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(
    undefined as undefined | { message: string }[]
  );

  useUser();

  const deleteRadar = (id: string) => {
    api
      .delete<DirectusResponse<void>>(`/items/trip_radar/${id}`)
      .then(() => {
        const newRadars = { ...radars };
        delete newRadars[id];
        setRadars(newRadars);
      })
      .catch((e) => {
        if (e instanceof AxiosError) {
          setErrors(e.request.errors);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    api
      .get<DirectusResponse<Radar[]>>("/items/trip_radar")
      .then((resp) => {
        if (resp.data.data) {
          setRadars(reduceIdsToObject(resp.data.data, (radar) => radar.id));
        }
      })
      .catch((e) => {
        if (e instanceof AxiosError) {
          setErrors(e.request.errors);
        }
      })
      .finally(() => setLoading(false));
  }, [setErrors]);

  const { t } = useTranslation();

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:radars.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:radars.head.title")}
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

        {!loading && Object.keys(radars).length === 0 && (
          <ReactMarkdown>{t("pages:radars.no_radars")}</ReactMarkdown>
        )}

        {radars &&
          Object.keys(radars).map((radarId) => {
            const radar = radars[radarId];
            return (
              <Card style={{ marginTop: ".75rem" }} key={radarId}>
                <Card.Header>
                  <Stack direction="horizontal">
                    {t("pages:radars.from_to", {
                      from: radar.from_name,
                      to: radar.to_name,
                      date: DateTime.fromISO(radar.date).toLocaleString(
                        DateTime.DATE_SHORT
                      ),
                    })}
                    <CloseButton
                      className="ms-auto"
                      onClick={() => deleteRadar(radarId)}
                      aria-label={t("pages:radars.delete_radar")}
                    ></CloseButton>
                  </Stack>
                </Card.Header>
                <Card.Body>
                  <>
                    {!radar.has_search_results &&
                      t("pages:radars.radar_no_trips")}

                    {radar.has_search_results && (
                      <Link
                        href={{
                          pathname: "/search",
                          query: {
                            from: radar.from.coordinates.join(","),
                            to: radar.to.coordinates.join(","),
                            fromName: radar.from_name,
                            toName: radar.to_name,
                            date: radar.date,
                          },
                        }}
                        passHref
                      >
                        <a target="_blank">
                          <Button>{t("pages:radars.radar_found_trips")}</Button>
                        </a>
                      </Link>
                    )}
                  </>
                </Card.Body>
              </Card>
            );
          })}
      </Container>
    </StandardLayout>
  );
};

export default RadarsView;
