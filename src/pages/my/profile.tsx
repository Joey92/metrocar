import React, { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useTranslation } from "next-i18next";
import Select from "react-select";

import { update } from "../../redux/reducers/user";
import { GetStaticProps, NextPage } from "next";
import ResetPasswordButton from "../../components/ResetPasswordButton";
import { useAction, useAppDispatch, useAppSelector } from "../../store";
import { Components } from "../../types/directus";
import api from "../../services/directus";
import { useRouter } from "next/router";
import StandardLayout from "../../components/layouts/Standard";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUser } from "../../util/hooks";
import { Button, Stack } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      // Will be passed to the page component as props
    },
  };
};

const ProfileView: NextPage = () => {
  const id = useUser();

  const { language: currentLanguage } = useAppSelector((state) => state.user);

  const { locale, locales } = useRouter();

  const updateUserAction = useAction(update);

  const updateUser = useCallback(
    (userData: Components.Schemas.Users) => updateUserAction(userData),
    [updateUserAction]
  );

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const [error, setError] = useState(null as string | null);
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState(locale);
  const [email_notifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);
    api("/users/me")
      .then((resp) => {
        const { display_name, email, email_notifications, description } =
          resp.data.data;
        setUsername(display_name);
        setEmail(email);
        setEmailNotifications(email_notifications);
        setDescription(description);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [id, setLoading]);

  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage]);

  const { t } = useTranslation();

  const languageOptions = locales?.map((lng) => ({
    label: t(`languages.${lng}.name`),
    value: lng,
  }));

  const userId = useUser();
  if (!userId) {
    return null;
  }

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:profile.head.title")}</title>
        <meta
          property="og:title"
          content={t("pages:profile.head.title")}
          key="title"
        />
      </Head>
      <Container>
        {!email && !error && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {email && (
          <Stack gap={3}>
            <h1>{username}</h1>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>{t("pages:profile.username.label")}</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder={t("pages:profile.username.label")}
                value={username}
                onChange={(evt) => {
                  setUsername(evt.target.value);
                }}
                onBlur={() => updateUser({ display_name: username })}
                onKeyPress={(e) =>
                  e.code === "Enter" && updateUser({ display_name: username })
                }
              />
              <Form.Text className="text-muted">
                {t("pages:profile.username.hint")}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>{t("pages:profile.description.label")}</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={3}
                placeholder={t("pages:profile.description.label")}
                value={description}
                onChange={(evt) => {
                  setDescription(evt.target.value);
                }}
                onBlur={() => updateUser({ description })}
                onKeyPress={(e) =>
                  e.code === "Enter" && updateUser({ description })
                }
              />
              <Form.Text className="text-muted">
                {t("pages:profile.description.hint")}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>{t("pages:profile.email.label")}</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder={t("pages:profile.email.label")}
                value={email}
                disabled={true}
              />
              <Form.Text className="text-muted">
                {t("pages:profile.email.hint")}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="language">
              <Form.Label>{t("pages:profile.language.label")}</Form.Label>
              <Select
                options={languageOptions}
                value={languageOptions?.find((opt) => opt.value === language)}
                onChange={(change) => {
                  if (!change) {
                    return;
                  }
                  setLanguage(change.value);
                  updateUser({ language: change.value });
                }}
                placeholder="Select language"
              />
              <Form.Text className="text-muted">
                {t("pages:profile.language.hint")}
              </Form.Text>
              {language !== currentLanguage && (
                <Alert variant="info">
                  {t("pages:profile.language.reload_hint")}
                </Alert>
              )}
            </Form.Group>
            <Form.Group controlId="email-notifications">
              <Form.Check
                type="checkbox"
                label={t("pages:profile.email-notifications.label")}
                defaultChecked={email_notifications}
                onChange={() => {
                  setEmailNotifications(!email_notifications);
                  updateUser({ email_notifications: !email_notifications });
                }}
              />

              <Form.Text className="text-muted">
                {t("pages:profile.email-notifications.hint")}
              </Form.Text>
            </Form.Group>
            <hr />

            <Stack direction="horizontal" gap={3}>
              <Link passHref href={`/user/${id}`}>
                <Button>{t("pages:profile.view_public_profile")}</Button>
              </Link>
              <ResetPasswordButton email={email} />
            </Stack>
          </Stack>
        )}
      </Container>
    </StandardLayout>
  );
};

export default ProfileView;
