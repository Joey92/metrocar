import React, { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

import Link from "next/link";
import Head from "next/head";

import { useRouter } from "next/router";

import StandardLayout from "../components/layouts/Standard";
import { useAppDispatch, useAppSelector } from "../store";
import { login } from "../redux/reducers/user";

import { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2 factor auth
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(undefined as string | undefined);

  const { t } = useTranslation();

  const { errors, loading, otpNeeded, token, language } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    if (token) {
      const { from = "/my/tickets" } = router.query;
      router.push(from as string, undefined, { locale: language });
    }
  }, [token, router, language]);

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    dispatch(
      login({
        email,
        password,
        otp,
      })
    );
  };

  useEffect(() => {
    if (otpNeeded) {
      setShowOtpInput(true);
    }
  }, [otpNeeded]);

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
        <title>{t("pages:login.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:login.head.title")}
          key="title"
        />
      </Head>
      <Container>
        <Row style={{ paddingTop: 30 }} className="justify-content-center">
          <Col lg={4}>
            <Form onSubmit={onSubmit} autoComplete="off">
              <Card>
                <Card.Header>{t("login")}</Card.Header>
                <Card.Body>
                  {router.query.from && (
                    <Alert variant="info">{t(`pages:login.info_alert`)}</Alert>
                  )}

                  {errors &&
                    errors.map((err, idx) => (
                      <Alert key={idx} variant="danger">
                        {t(`pages:login.errors.${err}`)}
                      </Alert>
                    ))}

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
                  <Form.Group as={Col} className="mb-3" controlId="password">
                    <Form.Label>{t("pages:login.password.label")}</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder={t("pages:login.password.placeholder")}
                      onChange={(evt) => {
                        setPassword(evt.target.value);
                      }}
                    />
                    <Form.Text className="text-muted">
                      <Link href="/forgot-password">
                        {t("pages:login.password.hint")}
                      </Link>
                    </Form.Text>
                  </Form.Group>
                  {showOtpInput && (
                    <>
                      <Alert variant="info">{t("pages:login.otp.hint")}</Alert>
                      <Form.Group as={Col} className="mb-3" controlId="otp">
                        <Form.Label>{t("pages:login.otp.label")}</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder={t("pages:login.otp.placeholder")}
                          onChange={(evt) => {
                            setOtp(evt.target.value);
                          }}
                        />
                      </Form.Group>
                    </>
                  )}
                </Card.Body>

                <Card.Footer>
                  <Button disabled={loading} type="submit">
                    {t("login")}
                  </Button>
                </Card.Footer>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
    </StandardLayout>
  );
};

export default Login;
