import React, { useEffect, useState } from "react";

import { GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../../types/directus";
import StandardLayout from "../../../components/layouts/Standard";
import api from "../../../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Alert, Card, Container, Spinner, Stack } from "react-bootstrap";
import { useUser } from "../../../util/hooks";
import { useAppSelector } from "../../../store";
import RouteBadge from "../../../components/RouteBadge";
import Link from "next/link";

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

const TripsView = () => {
  const [trips, setTrips] = useState(
    null as Components.Schemas.ItemsTrips[] | null
  );

  const agencyId = useAppSelector((state) => state.user.selectedAgency);

  useEffect(() => {
    api
      .get<DirectusResponse<Components.Schemas.ItemsTrips[]>>(`/items/trips`, {
        params: {
          filters: {
            agency: {
              _eq: agencyId,
            },
          },
          fields: ["*, route.*"],
        },
      })
      .then((resp) => {
        if (resp.data.data) {
          setTrips(resp.data.data);
        }
      });
  }, [setTrips, agencyId]);

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Container>
        {trips === null && <Spinner animation="border"></Spinner>}

        <Stack gap={3}>
          {trips && trips.length === 0 && (
            <Alert>No trips, yet. Add one now!</Alert>
          )}
          {trips &&
            trips.map((t) => (
              <Link href={`/agency/trips/${t.id}`} key={t.id}>
                <Card
                  key={t.id}
                  style={{ padding: ".75rem", cursor: "pointer" }}
                >
                  <Card.Title>
                    <RouteBadge
                      name={t.route?.route_short_name!}
                      textColor={t.route?.route_text_color!}
                      color={t.route?.route_color!}
                    />{" "}
                    {t.route?.route_long_name}
                  </Card.Title>
                  {t.route?.route_desc && (
                    <Card.Body>{t.route?.route_desc}</Card.Body>
                  )}
                </Card>
              </Link>
            ))}
        </Stack>
      </Container>
    </StandardLayout>
  );
};

export default TripsView;
