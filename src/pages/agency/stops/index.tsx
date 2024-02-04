import React, { useEffect, useMemo, useState } from "react";

import { GetStaticProps } from "next";
import { Components, DirectusResponse } from "../../../types/directus";
import dynamic from "next/dynamic";
import StandardLayout from "../../../components/layouts/Standard";
import api from "../../../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAppSelector } from "../../../store";
import { Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../util/hooks";

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
const StopsView = () => {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState([] as Components.Schemas.ItemsStops[]);
  const selectedAgency = useAppSelector((state) => state.user.selectedAgency);
  const { t } = useTranslation();
  useEffect(() => {
    setLoading(true);
    if (!selectedAgency) {
      setLoading(false);
      return;
    }

    api
      .get<DirectusResponse<Components.Schemas.ItemsStops[]>>("/items/stops", {
        params: {
          filter: {
            agency_id: {
              _eq: selectedAgency,
            },
          },
        },
      })
      .then((data) => {
        setStops(data.data.data);
      })
      .finally(() => setLoading(false));
  }, [selectedAgency]);

  const Map = useMemo(
    () =>
      dynamic(
        () => import("../../../components/maps/StopsMap"), // replace '@components/map' with your component's location
        {
          loading: () => <p>Map is Loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [
      /* list variables which should trigger a re-render here */
    ]
  );

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      {loading && <Spinner animation="border"></Spinner>}
      {!loading && (
        <>
          {stops.length == 0 && <Alert>{t("no_stops")}</Alert>}
          <Map stops={stops} />
        </>
      )}
    </StandardLayout>
  );
};

export default StopsView;
