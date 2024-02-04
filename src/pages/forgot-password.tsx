import React, { useState } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ResetPasswordButton from "../components/ResetPasswordButton";
import StandardLayout from "../components/layouts/Standard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState("");

  const { t } = useTranslation();

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:forgot_password.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:forgot_password.head.title")}
          key="title"
        />
      </Head>
      <Container>
        <Row>
          <Form.Group as={Col} className="mb-3" controlId="email">
            <Form.Label>{t("pages:login.email.label")}</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder={t("pages:login.email.placeholder")}
              onChange={(evt) => {
                setEmail(evt.target.value);
              }}
            />
          </Form.Group>
          <ResetPasswordButton email={email} />
        </Row>
      </Container>
    </StandardLayout>
  );
};

export default ForgotPassword;
