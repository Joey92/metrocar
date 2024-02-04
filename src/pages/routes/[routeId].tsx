import React from "react";
import Container from "react-bootstrap/Container";

import { GetStaticPaths, GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../types/directus";
import { internalApi as api } from "../../services/directus";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../components/layouts/Standard";
import { Trips } from "../../services/otp";
import { useTranslation } from "react-i18next";
import { Stack } from "react-bootstrap";
import RouteBadge from "../../components/RouteBadge";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Geometry } from "../../types/geo";
import Head from "next/head";

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const { routeId } = params;

  if (!routeId) {
    return {
      notFound: true,
    };
  }

  try {
    const routeRes = await api.get<
      DirectusResponse<Components.Schemas.ItemsRoutes>
    >(`/items/routes/${routeId}`);

    const route = routeRes.data.data;

    let trips = null;
    // enable some time later..
    // try {
    //   const tripsResp = await otp.get<Trips[]>(
    //     `/otp/routers/default/index/routes/MetroCar:${routeId}/trips`
    //   );

    //   trips = tripsResp.data;
    // } catch (e) {}

    let shape = null;
    try {
      const shapesResp = await api.get<
        DirectusResponse<Components.Schemas.ItemsShapes[]>
      >("/items/shapes", {
        params: {
          fields: ["shape"],
          filter: {
            route_hash: {
              _eq: route.route_hash,
            },
          },
        },
      });

      shape = shapesResp.data.data;
    } catch (e) {}

    return {
      props: {
        ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
        route,
        trips,
        shape,
      },
      revalidate: 3600,
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const apiRes = await api.get<
      DirectusResponse<Components.Schemas.ItemsStops[]>
    >("/items/routes", {
      params: {
        fields: ["id"],
      },
    });

    const routes = apiRes.data.data;

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return {
      paths: routes.map((route) => ({
        params: { routeId: route.id! },
      })),
      fallback: "blocking",
    };
  } catch (e) {
    return { paths: [], fallback: "blocking" };
  }
};

interface Props {
  route: Components.Schemas.ItemsRoutes;
  trips: Trips[];
  shape: Components.Schemas.ItemsShapes[];
}
const RouteView = ({ route, trips, shape }: Props) => {
  const RouteViewMap = React.useMemo(
    () =>
      dynamic(
        () => import("../../components/maps/RouteMap"), // replace '@components/map' with your component's location
        {
          loading: () => <p>Map is Loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [
      /* list variables which should trigger a re-render here */
    ]
  );

  const { t } = useTranslation();

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:route_view.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:route_view.head.title")}
          key="title"
        />
      </Head>
      <Container>
        <Stack gap={3}>
          <h1>
            <RouteBadge
              key={route.id}
              name={route.route_short_name!}
              textColor={route.route_text_color!}
              color={route.route_color!}
            />{" "}
            {route.route_long_name}
          </h1>
          {shape && shape.length > 0 && (
            <RouteViewMap
              geom={shape[0].shape as Geometry}
              color={route.route_color!}
            />
          )}
          {route.route_desc && (
            <>
              <hr />
              <ReactMarkdown>{route.route_desc}</ReactMarkdown>
              <hr />
            </>
          )}
          {trips && trips.length > 0 && (
            <>
              <h2>{t("pages:route_view.participating_trips")}</h2>
              <ol>
                {trips.map((trip, idx) => (
                  <li key={idx}>
                    <Link href={`/trip/${trip.id.replace("MetroCar:", "")}`}>
                      <h2>{trip.tripHeadsign}</h2>
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          )}
        </Stack>
      </Container>
    </StandardLayout>
  );
};

export default RouteView;
