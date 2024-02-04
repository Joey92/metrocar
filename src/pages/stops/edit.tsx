import React, { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import * as actions from "../../redux/reducers/stop_view";
import { useTranslation } from "next-i18next";

import dynamic from "next/dynamic";
import { useAction, useAppDispatch, useAppSelector } from "../../store";

import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUser } from "../../util/hooks";
import StandardLayout from "../../components/layouts/Standard";
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const EditStopsView: NextPage = () => {
  const userId = useUser();

  const fetchStops = useAction(actions.fetchStops);

  useEffect(() => {
    fetchStops();
  }, [fetchStops]);

  const { stops, loading, error } = useAppSelector((state) => state.stopView);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const Map = React.useMemo(
    () =>
      dynamic(
        () => import("../../components/maps/StopEditMap"), // replace '@components/map' with your component's location
        {
          loading: () => <p>Map is Loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    []
  );

  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      {Object.keys(stops).length === 0 && !error && (
        <Spinner animation="border" />
      )}

      {userId && <Alert variant="info">{t("pages:report_stop.info")}</Alert>}
      {error && <Alert>{error}</Alert>}
      <Map
        loading={loading}
        userId={userId}
        stops={Object.values(stops)}
        reportStop={(stop) => dispatch(actions.manageStop(stop))}
      />
    </StandardLayout>
  );
};

export default EditStopsView;
