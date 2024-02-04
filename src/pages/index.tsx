import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import ReactMarkdown from "react-markdown";
import { GetStaticProps } from "next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import StandardLayout from "../components/layouts/Standard";
import Head from "next/head";

import { Stack } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store";
import { searchTrip, setTo as setToAction } from "../redux/reducers/search";
import GeolocationAsyncSelect from "../components/GeolocationAsyncSelect";
import { useRouter } from "next/router";
import { CoordinateSelectValue } from "../types/types";
import { SingleValue } from "react-select";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", [
        "common",
        "MainPage",
        "pages",
      ])),
      // Will be passed to the page component as props
    },
  };
};

const MainPage = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const to = useAppSelector((state) => state.search.to);

  const goToSearch =
    (destination: SingleValue<CoordinateSelectValue>) =>
    async (d: typeof dispatch) => {
      await d(setToAction(destination));
      await d(searchTrip());
      router.push("/search");
    };

  return (
    <StandardLayout>
      <Head>
        <title>MetroCar</title>
        <meta property="og:title" content="MetroCar" key="title" />
      </Head>
      <Container style={{ paddingTop: ".75rem" }}>
        <Stack gap={3}>
          <Row className="main-text" xs="1" md="3" sm="2">
            {(
              t("MainPage:textblocks", {
                returnObjects: true,
                defaultValue: [],
              }) as string[]
            ).map((txt, idx) => (
              <Col key={idx}>{txt}</Col>
            ))}
          </Row>

          <Stack direction="horizontal" className="mx-auto">
            <GeolocationAsyncSelect
              placeholder={t("pages:search.destination.label")}
              value={to}
              onChange={(val) => {
                const searchRequest = goToSearch(val);
                dispatch(searchRequest);
              }}
            />
          </Stack>
          <div>
            <h2>FAQ</h2>
            <Accordion defaultActiveKey="0">
              {(
                t("MainPage:faq", {
                  returnObjects: true,
                  defaultValue: [],
                }) as {
                  q: string;
                  a: string;
                }[]
              ).map(({ q, a }, key) => (
                <Accordion.Item eventKey={key.toString()} key={key}>
                  <Accordion.Header>{q}</Accordion.Header>
                  <Accordion.Body>
                    <ReactMarkdown>{a}</ReactMarkdown>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </Stack>
      </Container>
    </StandardLayout>
  );
};

export default MainPage;
