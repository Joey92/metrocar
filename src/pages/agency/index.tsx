import React, { useEffect, useState } from "react";

import { GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../types/directus";
import StandardLayout from "../../components/layouts/Standard";
import api from "../../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Card, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { useUser } from "../../util/hooks";
import { useAppSelector } from "../../store";
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
  const [agency, setAgency] = useState(
    null as Components.Schemas.ItemsAgencies | null
  );

  const agencyId = useAppSelector((state) => state.user.selectedAgency);

  useEffect(() => {
    if (!agencyId) {
      return;
    }

    api
      .get<DirectusResponse<Components.Schemas.ItemsAgencies>>(
        `/items/agencies/${agencyId}`
      )
      .then((resp) => {
        if (resp.data.data) {
          setAgency(resp.data.data);
        }
      });
  }, [setAgency, agencyId]);

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Container>
        {!agency && <Spinner animation="border"></Spinner>}
        {agency && (
          <Stack gap={3}>
            <h1>{agency.agency_name}</h1>
            <Row>
              <Card as={Col} style={{ cursor: "pointer", margin: ".75rem" }}>
                <Link href="/agency/trips">
                  <Card.Body>
                    <Card.Title>Trips</Card.Title>
                    <Card.Subtitle>0 alerts</Card.Subtitle>
                  </Card.Body>
                </Link>
              </Card>
              <Card as={Col} style={{ cursor: "pointer", margin: ".75rem" }}>
                <Link href="/agency/stops">
                  <Card.Body>
                    <Card.Title>Stops</Card.Title>
                    <Card.Subtitle>0 alerts</Card.Subtitle>
                  </Card.Body>
                </Link>
              </Card>
              <Card as={Col} style={{ cursor: "pointer", margin: ".75rem" }}>
                <Link href="/agency/routes">
                  <Card.Body>
                    <Card.Title>Routes</Card.Title>
                    <Card.Subtitle>0 alerts</Card.Subtitle>
                  </Card.Body>
                </Link>
              </Card>
              <Card as={Col} style={{ cursor: "pointer", margin: ".75rem" }}>
                <Link href="/agency/prices">
                  <Card.Body>
                    <Card.Title>Prices</Card.Title>
                    <Card.Subtitle>0 alerts</Card.Subtitle>
                  </Card.Body>
                </Link>
              </Card>
            </Row>
          </Stack>
        )}
      </Container>
    </StandardLayout>
  );
};

export default RoutesView;
