import React, { useEffect, useState } from "react";

import { GetStaticPaths, GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../../types/directus";
import StandardLayout from "../../../components/layouts/Standard";
import api from "../../../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Card, Container, Spinner, Stack } from "react-bootstrap";
import { useUser } from "../../../util/hooks";
import { useAppSelector } from "../../../store";
import RouteBadge from "../../../components/RouteBadge";
import Link from "next/link";
import { useRouter } from "next/router";

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
    },
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: [], fallback: "blocking" };
};

const TripsView = () => {
  const [trip, setTrip] = useState(
    null as Components.Schemas.ItemsTrips | null
  );

  const router = useRouter();
  const tripId = router.query.id;

  const agencyId = useAppSelector((state) => state.user.selectedAgency);

  useEffect(() => {
    api
      .get<DirectusResponse<Components.Schemas.ItemsTrips>>(
        `/items/trips/${tripId}`,
        {
          params: {
            fields: ["*, route.*"],
          },
        }
      )
      .then((resp) => {
        if (resp.data.data) {
          setTrip(resp.data.data);
        }
      });
  }, [setTrip, agencyId, tripId]);

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Container>
        {!trip && <Spinner animation="border"></Spinner>}
        {trip && (
          <Stack gap={3}>
            <Link href={`/agency/trips/${trip.id}`} key={trip.id}>
              <Card
                key={trip.id}
                style={{ padding: ".75rem", cursor: "pointer" }}
              >
                <Card.Title>
                  <RouteBadge
                    name={trip.route?.route_short_name!}
                    textColor={trip.route?.route_text_color!}
                    color={trip.route?.route_color!}
                  />{" "}
                  {trip.route?.route_long_name}
                </Card.Title>
                {trip.route?.route_desc && (
                  <Card.Body>{trip.route?.route_desc}</Card.Body>
                )}
              </Card>
            </Link>
          </Stack>
        )}
      </Container>
    </StandardLayout>
  );
};

export default TripsView;
