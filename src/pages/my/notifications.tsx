import React, { useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";

import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DirectusNotification } from "../../types/types";
import api from "../../services/directus";
import {
  Badge,
  Button,
  Card,
  CloseButton,
  Spinner,
  Stack,
} from "react-bootstrap";
import StandardLayout from "../../components/layouts/Standard";
import { DateTime } from "luxon";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Head from "next/head";
import { useUser } from "../../util/hooks";

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

// const descRegex = /\(.+\)/i;
const Notifications: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState(
    [] as DirectusNotification[]
  );

  const userId = useUser();

  // fetch notifications
  useEffect(() => {
    api
      .get("/notifications", {
        params: {
          meta: "total_count",
        },
      })
      .then((resp) => {
        setNotifications(resp.data.data);
      })
      .finally(() => setLoading(false));
  }, [setNotifications, setLoading]);

  // set notifications to archived, if we have new ones
  // so they don't appear in the counter
  useEffect(() => {
    const ids = notifications.filter(
      (notification) => notification.status === "inbox"
    );

    if (ids.length === 0) {
      return;
    }

    api.patch("/notifications", {
      keys: ids.map((notification) => notification.id),
      data: {
        status: "archived",
      },
    });
  }, [notifications]);

  const { t } = useTranslation();

  const footerContent = useMemo(
    () =>
      notifications.map((notification) => {
        if (!notification.collection) {
          return;
        }

        switch (notification.collection) {
          case "trip_radar":
            return {
              text: "pages:notifications.footer.collection.trip_radar",
              link: {
                pathname: "/my/radars",
              },
            };
          default:
        }
      }),
    [notifications]
  );

  const deleteNotification = (id: number, idx: number) =>
    api.delete(`/notifications/${id}`).then(() => {
      const newNotifications = [...notifications];
      newNotifications.splice(idx, 1);
      setNotifications(newNotifications);
    });

  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:notifications.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:notifications.head.title")}
          key="title"
        />
      </Head>
      <Container>
        {loading && <Spinner animation="border" />}

        {!loading && notifications.length === 0 && (
          <h1>{t("no_notifications")}</h1>
        )}
        <Stack gap={3}>
          {notifications.map((notification, idx) => (
            <Card key={idx}>
              <Card.Header>
                <Stack direction="horizontal">
                  <>
                    {notification.status === "inbox" && (
                      <Badge>{t("pages:notifications:inbox_badge")}</Badge>
                    )}
                    {notification.timestamp &&
                      DateTime.fromISO(notification.timestamp).toRelative()}
                  </>
                  <CloseButton
                    className="ms-auto"
                    aria-label="Hide"
                    onClick={() => deleteNotification(notification.id!, idx)}
                  />
                </Stack>
              </Card.Header>
              <Card.Body>{notification.subject}</Card.Body>
              {footerContent[idx] && (
                <Card.Footer>
                  <Link href={footerContent[idx]!.link}>
                    <Button>{t(footerContent[idx]!.text)}</Button>
                  </Link>
                </Card.Footer>
              )}
            </Card>
          ))}
        </Stack>
      </Container>
    </StandardLayout>
  );
};

export default Notifications;
