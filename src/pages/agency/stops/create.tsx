import React from "react";
import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../../../components/layouts/Standard";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const TripEditor: NextPage = () => {
  return <StandardLayout></StandardLayout>;
};

export default TripEditor;
