import { useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "next-i18next";
import { FRONTEND_URL } from "../config";
import api from "../services/directus";
import { useMemo } from "react";

const ResetPasswordButton = ({
  email,
  ...props
}: {
  [index: string]: any;
  email: string;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const submit = useMemo(
    () => () => {
      setLoading(true);
      api
        .post("/auth/password/request", {
          email,
          reset_url: `${FRONTEND_URL}/password-reset`,
        })
        .then(() => {
          setSubmitted(true);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    },
    [email]
  );

  return (
    <Button {...props} disabled={loading} onClick={submit}>
      {loading && <Spinner animation="border" />}
      {submitted
        ? t("pages:forgot_password.email_sent")
        : t("pages:profile.reset_password")}
    </Button>
  );
};

export default ResetPasswordButton;
