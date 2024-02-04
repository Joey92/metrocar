import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

import { useTranslation } from "next-i18next";
import { GetStaticProps, NextPage } from "next";
import api from "../services/directus";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import StandardLayout from "../components/layouts/Standard";
import { useAppSelector } from "../store";
import { AxiosError } from "axios";
import { Error, ErrorElement } from "../types/directus";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const RegistrationForm: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorField, setErrorField] = useState(
    undefined as "username" | "password" | "generic" | undefined
  );
  const [error, setError] = useState(
    undefined as ErrorElement["extensions"]["code"] | undefined
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();

  const { language, token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      router.push("/my/tickets", undefined, { locale: language });
    }
  }, [token, router, language]);

  useEffect(() => {
    setError(undefined); // reset error when user types
  }, [username, password]);

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    setLoading(true);

    if (username.length > 50) {
      setErrorField("username");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorField("password");
      setLoading(false);
      return;
    }

    api
      .post("/users", {
        email,
        password,
        display_name: username,
        language: locale,
      })
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          const { errors } = err.response?.data as Error;

          const error_code =
            errors.length > 0 ? errors[0].extensions.code : undefined;
          setError(error_code);
          setLoading(false);
          evt.stopPropagation();
        }
      });
  };

  if (token) {
    return (
      <StandardLayout>
        <Alert variant="info">{t("redirect_incoming")}</Alert>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:register.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:register.head.title")}
          key="title"
        />
      </Head>
      <Container>
        <Row style={{ paddingTop: 30 }}>
          <Col lg={4}>
            <Card>
              <Card.Header>{t("register")}</Card.Header>
              <Card.Body>
                {submitted && (
                  <Row>
                    <Alert variant="success">
                      {t("pages:registration.account_created")}
                    </Alert>
                  </Row>
                )}

                {error && (
                  <Row>
                    <Alert variant="danger">
                      {t(`pages:registration.errors.${error}.email`)}
                    </Alert>
                  </Row>
                )}

                <Row>
                  <Form onSubmit={onSubmit} autoComplete="off">
                    <Form.Group as={Col} className="mb-3" controlId="email">
                      <Form.Label>
                        {t("pages:registration.email.label")}
                      </Form.Label>
                      <Form.Control
                        required
                        type="email"
                        placeholder={t("pages:registration.email.label")}
                        onChange={(evt) => setEmail(evt.target.value)}
                      />
                      <Form.Text className="text-muted">
                        {t("pages:registration.email.hint")}
                      </Form.Text>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3" controlId="username">
                      <Form.Label>
                        {t("pages:registration.username.label")}
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder={t("pages:registration.username.label")}
                        onChange={(evt) => setUsername(evt.target.value)}
                        isInvalid={errorField === "username"}
                        isValid={!!username}
                      />
                      <Form.Text className="text-muted">
                        {t("pages:registration.username.hint")}
                      </Form.Text>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3" controlId="password">
                      <Form.Label>
                        {t("pages:registration.password.label")}
                      </Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder={t("pages:registration.password.label")}
                        onChange={(evt) => setPassword(evt.target.value)}
                        isInvalid={errorField === "password"}
                        isValid={password.length >= 8}
                      />
                      <Form.Text className="text-muted">
                        {t("pages:registration.password.hint")}
                      </Form.Text>
                    </Form.Group>

                    <Button disabled={loading} type="submit">
                      {t("register")}
                    </Button>
                  </Form>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </StandardLayout>
  );
};

export default RegistrationForm;
