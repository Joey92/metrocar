import React, { useEffect, useState } from "react";

import { GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../../types/directus";
import StandardLayout from "../../../components/layouts/Standard";
import api from "../../../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Card, Container, Spinner, Stack } from "react-bootstrap";
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

const RoutesView = () => {
  const [routes, setRoutes] = useState([] as Components.Schemas.ItemsRoutes[]);

  const agencyId = useAppSelector((state) => state.user.selectedAgency);

  useEffect(() => {
    api
      .get<DirectusResponse<Components.Schemas.ItemsRoutes[]>>(
        `/items/routes`,
        {
          params: {
            filters: {
              agency: {
                _eq: agencyId,
              },
            },
          },
        }
      )
      .then((resp) => {
        if (resp.data.data) {
          setRoutes(resp.data.data);
        }
      });
  }, [setRoutes, agencyId]);

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Container>
        {!routes && <Spinner animation="border"></Spinner>}
        <Stack gap={3}>
          {routes.map((r) => (
            <Link href={`/agency/routes/${r.id}`} key={r.id}>
              <Card key={r.id} style={{ padding: ".75rem", cursor: "pointer" }}>
                <Card.Title>
                  <RouteBadge
                    key={r.id}
                    name={r.route_short_name!}
                    textColor={r.route_text_color!}
                    color={r.route_color!}
                  />{" "}
                  {r.route_long_name}
                </Card.Title>
                {r.route_desc && <Card.Body>{r.route_desc}</Card.Body>}
              </Card>
            </Link>
          ))}
        </Stack>
      </Container>
    </StandardLayout>
  );
};

export default RoutesView;
