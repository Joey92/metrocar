import React, { FormEvent, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { useTranslation } from "next-i18next";

import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import api from "../services/directus";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import StandardLayout from "../components/layouts/Standard";
import { parseJwt } from "../util/auth";
import { DateTime } from "luxon";
import Head from "next/head";
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const PasswordReset: NextPage = () => {
  const router = useRouter();
  const token = router.query.token as string;

  const parsedToken = useMemo(
    () => (token ? parseJwt(token) : undefined),
    [token]
  );

  const expired = useMemo(
    () =>
      parsedToken
        ? DateTime.fromSeconds(parsedToken.exp).diffNow().toMillis() < 0
        : false,
    [parsedToken]
  );

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const { t } = useTranslation();

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("pages:password_reset.password_invalid");
      return;
    }

    if (password.length === 0 || password !== passwordRepeat) {
      setError("pages:password_reset.password_no_match");
      return;
    }

    setLoading(true);
    api
      .post("/auth/password/reset", {
        password,
        token,
      })
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch(() => {
        setError("pages:password_reset.error");
      });
  };

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:password_reset.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:password_reset.head.title")}
          key="title"
        />
      </Head>
      <Container>
        {error && <Alert variant="danger">{t(error)}</Alert>}
        {submitted && (
          <Alert variant="success">{t("pages:password_reset.success")}</Alert>
        )}
        {parsedToken === null && (
          <Alert variant="danger">
            {t("pages:password_reset.token_invalid")}
          </Alert>
        )}
        {expired && (
          <Alert variant="danger">
            {t("pages:password_reset.token_expired")}
          </Alert>
        )}

        {token && !expired && parsedToken !== null && (
          <Form onSubmit={onSubmit}>
            <Form.Group as={Col} className="mb-3" controlId="password">
              <Form.Label>{t("pages:password_reset.newPassword")}</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder={t("pages:password_reset.newPassword")}
                onChange={(evt) => {
                  setPassword(evt.target.value);
                }}
                isInvalid={error === "pages:password_reset.password_invalid"}
                isValid={password.length >= 8}
              />
              <Form.Text className="text-muted">
                {t("pages:registration.password.hint")}
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="password_repeat">
              <Form.Label>
                {t("pages:password_reset.repeatPassword")}
              </Form.Label>
              <Form.Control
                required
                type="password"
                placeholder={t("pages:password_reset.repeatPassword")}
                isInvalid={error === "pages:password_reset.password_no_match"}
                onChange={(evt) => {
                  setPasswordRepeat(evt.target.value);
                }}
              />
            </Form.Group>

            <Button disabled={loading} type="submit">
              {t("pages:password_reset.reset_password")}
            </Button>
          </Form>
        )}
      </Container>
    </StandardLayout>
  );
};

export default PasswordReset;
