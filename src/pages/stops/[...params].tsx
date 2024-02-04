import React, { useMemo } from "react";
import Container from "react-bootstrap/Container";

import { GetStaticPaths, GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../types/directus";
import { baseURL, internalApi as api } from "../../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../components/layouts/Standard";
import { DateTime } from "luxon";
import otp, { StopTimeResponse, Time } from "../../services/otp";
import { useTranslation } from "react-i18next";
import { Badge, Stack } from "react-bootstrap";
import RouteBadge from "../../components/RouteBadge";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { MAPBOX_TOKEN } from "../../config";
import { stdout } from "process";
import Head from "next/head";

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const apiRes = await api.get<
      DirectusResponse<Components.Schemas.ItemsStops[]>
    >("/items/stops", {
      params: {
        fields: ["id"],
      },
    });

    const stops = apiRes.data.data;

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return {
      paths: stops.map((s) => ({
        params: { params: [s.id!] },
      })),
      fallback: "blocking",
    };
  } catch (e) {
    return { paths: [], fallback: "blocking" };
  }
};

const getMapPictureFile = async (
  stop: Components.Schemas.ItemsStops
): Promise<Components.Schemas.Files | null> => {
  try {
    if (stop.private) {
      return null;
    }
    if (stop.map_image) {
      const imgData = await api.get<DirectusResponse<Components.Schemas.Files>>(
        `/files/${stop.map_image}`,
        {
          params: {
            fields: ["id", "width", "height"],
          },
        }
      );

      return imgData.data.data;
    }

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN == "") {
      return null;
    }
    // get new image and upload
    const [lon, lat] = (stop.location as GeoJSON.Point).coordinates;

    const imgData = await api.post<DirectusResponse<Components.Schemas.Files>>(
      "/files/import",
      {
        url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${JSON.stringify(
          stop.location
        )})/${lon},${lat},16/889x500?access_token=${MAPBOX_TOKEN}`,
        data: {
          title: `Stop ${stop.stop_name}`,
        },
      }
    );

    await api.patch<DirectusResponse<Components.Schemas.ItemsStops>>(
      `/items/stops/${stop.id}`,
      {
        map_image: imgData.data.data.id,
      }
    );

    return imgData.data.data;
  } catch (e) {
    stdout.write(JSON.stringify(e));
    return null;
  }
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const [stopId, date] = params.params as string[];

  if (!stopId) {
    return {
      notFound: true,
    };
  }

  try {
    const apiRes = await api.get<
      DirectusResponse<Components.Schemas.ItemsStops>
    >(`/items/stops/${stopId}`);

    const stop = apiRes.data.data;

    // fetch departures of the current date from OTP
    const searchDate = date
      ? DateTime.fromSQL(date).toSQLDate()
      : DateTime.now().toSQLDate();
    let arrivals = null;
    let routes: Record<string, Components.Schemas.ItemsRoutes> | null = null;
    try {
      const arrivalsResponse = await otp.get<StopTimeResponse[]>(
        `/otp/routers/default/index/stops/MetroCar:${stopId}/stoptimes/${searchDate}`
      );

      const routeIds = arrivalsResponse.data
        .filter((resp) => resp.pattern.routeId.startsWith("MetroCar:"))
        .map((resp) => resp.pattern.routeId.replace("MetroCar:", ""));

      const routesResp = await api.get<
        DirectusResponse<Components.Schemas.ItemsRoutes[]>
      >("/items/routes", {
        params: {
          filter: {
            id: {
              _in: routeIds,
            },
          },
          fields: ["id", "route_short_name", "route_text_color", "route_color"],
        },
      });

      const routeMap = routesResp.data.data.reduce((acc, route) => {
        if (route) {
          acc[route.id!] = route;
        }
        return acc;
      }, {} as Record<string, Components.Schemas.ItemsRoutes>);

      arrivals = arrivalsResponse.data
        .filter((route) => route.times.length > 0)
        .flatMap((route) =>
          route.times.map((t) => ({
            ...t,
            routeId: route.pattern.routeId.replace("MetroCar:", ""),
          }))
        )
        .sort((a, b) => a.scheduledArrival - b.scheduledArrival)
        .map((departure) => ({
          ...departure,
          route: routeMap[departure.routeId] || null,
        }));

      routes = routeMap;
    } catch (e) {}

    let mapPicture: null | Components.Schemas.Files = null;
    try {
      mapPicture = await getMapPictureFile(stop);
    } catch (e) {
      stdout.write(JSON.stringify(e));
    }

    return {
      props: {
        ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
        stop,
        arrivals,
        routes,
        date: searchDate,
        mapPicture,
      },
      revalidate: 3600,
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

interface Props {
  stop: Components.Schemas.ItemsStops;
  arrivals:
    | (Time & {
        route?: Components.Schemas.ItemsRoutes;
      })[]
    | null;
  routes: Record<string, Components.Schemas.ItemsRoutes>;
  date: string;
  mapPicture: null | Components.Schemas.Files;
}
const StopView = ({ stop, arrivals, routes, date, mapPicture }: Props) => {
  // const StopViewMap = React.useMemo(
  //   () =>
  //     dynamic(
  //       () => import("../../components/StopMap"), // replace '@components/map' with your component's location
  //       {
  //         loading: () => <p>Map is Loading</p>,
  //         ssr: false, // This line is important. It's what prevents server-side render
  //       }
  //     ),
  //   [
  //     /* list variables which should trigger a re-render here */
  //   ]
  // );

  const { t } = useTranslation();

  const currentDate = useMemo(() => DateTime.fromSQL(date), [date]);

  return (
    <StandardLayout>
      <Head>
        <title>
          {t("pages:stop_view.head.title", { name: stop.stop_name })}
        </title>
        <meta
          property="og:title"
          content={t("pages:stop_view.head.title", { name: stop.stop_name })}
          key="title"
        />
      </Head>
      <Container>
        <Stack gap={3}>
          {stop && <h1>{stop.stop_name}</h1>}
          {!mapPicture && "Currently no map picture available"}
          {mapPicture && (
            // We have an issue with nextjs image:
            // We want to load the image from directus
            // But we can't load it from the client side because they don't have
            // the internal domain.
            // The client has not access to the internal domain of directus
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${baseURL}/assets/${mapPicture.id}`}
              alt={"Station location"}
              width={mapPicture.width!}
              height={mapPicture.height!}
            ></img>
          )}
          {/* <StopViewMap stop={stop} /> */}
          {!routes && t("pages:stop_view.no_lines_yet")}
          {routes && (
            <Stack direction="horizontal" gap={2}>
              {t("pages:stop_view.lines_passing")}:
              {Object.values(routes).map((r) => (
                <RouteBadge
                  key={r.id}
                  href={`/routes/${r.id}`}
                  name={r.route_short_name!}
                  textColor={r.route_text_color!}
                  color={r.route_color!}
                />
              ))}
            </Stack>
          )}

          {stop.stop_desc && (
            <>
              <hr />
              <ReactMarkdown>{stop.stop_desc}</ReactMarkdown>
              <hr />
            </>
          )}
          {arrivals && arrivals.length > 0 && (
            <>
              <h2>{t("pages:stop_view.todays_departures")}</h2>
              <ol>
                {arrivals.map((trip, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/trip/${trip.tripId.replace("MetroCar:", "")}`}
                    >
                      <h2>
                        {!currentDate
                          ? date
                          : currentDate
                              .plus({ seconds: trip.scheduledArrival })
                              .toFormat("HH:mm")}
                        {trip.route && (
                          <Stack direction="horizontal" gap={3}>
                            <RouteBadge
                              key={trip.route.id}
                              name={trip.route.route_short_name!}
                              textColor={trip.route.route_text_color!}
                              color={trip.route.route_color!}
                            />
                            {trip.headsign}
                            <Badge bg="warning">
                              {t("pages:stop_view.trip_ends_here")}
                            </Badge>
                          </Stack>
                        )}
                      </h2>
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          )}
          {/* disable loading next date */}
          {/* <Button onClick={() => setDate(date.plus({ days: 1 }))}>
        {t("load_next_date")}
      </Button> */}
        </Stack>
      </Container>
    </StandardLayout>
  );
};

export default StopView;
