import React from "react";
import Container from "react-bootstrap/Container";
import { internalApi as api } from "../../services/directus";
import { Components, DirectusResponse } from "../../types/directus";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../components/layouts/Standard";
import RouteBadge from "../../components/RouteBadge";
import { Stack } from "react-bootstrap";
import InternalInitiarary from "../../components/Itinarary";
import { DateTime } from "luxon";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  res,
}) => {
  const { tripId } = params!;

  try {
    const apiRes = await api.get<
      DirectusResponse<Components.Schemas.ItemsTrips>
    >(`/items/trips/${tripId}`, {
      params: {
        fields: [
          "id",
          "start_date",
          "route.id",
          "route.route_text_color",
          "route.route_color",
          "route.route_short_name",
          "trip_headsign",
          "stop_times.arrival",
          "stop_times.departure",
          "stop_times.stop_sequence",
          "stop_times.stop.stop_name",
          "stop_times.stop.stop_url",
          "stop_times.stop.id",
        ],
      },
    });

    const trip = apiRes.data.data;

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600"
    );

    return {
      props: {
        ...(await serverSideTranslations(locale || "en", [
          "common",
          "pages",
          "trip",
        ])),
        trip,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

const TripView = ({ trip }: { trip: Components.Schemas.ItemsTrips }) => {
  const route = trip.route as Components.Schemas.ItemsRoutes;
  return (
    <Container>
      <StandardLayout>
        <Stack gap={3}>
          <h1>
            <RouteBadge
              key={route.id}
              name={route.route_short_name!}
              textColor={route.route_text_color!}
              color={route.route_color!}
              href={`/routes/${route.id}`}
            />{" "}
            {trip.trip_headsign}
          </h1>

          <InternalInitiarary route={route} stopTimes={trip.stop_times} />
        </Stack>
      </StandardLayout>
      {/* <Trip {...trip} tickets={undefined} /> */}
    </Container>
  );
};

export default TripView;
