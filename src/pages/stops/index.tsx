import React, { useMemo } from "react";

import { GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../types/directus";
import dynamic from "next/dynamic";
import Layout from "../../components/layouts/Slim";
import { internalApi as api } from "../../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "react-i18next";

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const res = await api.get<DirectusResponse<Components.Schemas.ItemsStops[]>>(
    "/items/stops",
    {
      params: {
        filter: {
          _and: [
            {
              active: {
                _eq: true,
              },
            },
            {
              agency_id: {
                _null: true,
              },
            },
          ],
        },
      },
    }
  );

  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      stops: res.data.data,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60, // In seconds
  };
};
const StopsView = ({ stops }: { stops: Components.Schemas.ItemsStops[] }) => {
  const Map = useMemo(
    () =>
      dynamic(
        () => import("../../components/maps/StopsMap"), // replace '@components/map' with your component's location
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
    <Layout>
      <Head>
        <title>{t("pages:stops_view.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:stops_view.head.title")}
          key="title"
        />
      </Head>
      <Map stops={stops} />
    </Layout>
  );
};

export default StopsView;
