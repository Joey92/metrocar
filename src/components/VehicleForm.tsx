import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import * as actions from "../redux/reducers/trip_editor";
import { useAction, useAppSelector } from "../store";

const VehicleForm = () => {
  const { t } = useTranslation();

  const [description, setDescription] = useState("");
  const [licenseplate, setLicenseplate] = useState("");

  const createVehicle = useAction(actions.createVehicle);

  const { loading } = useAppSelector((state) => state.user);
  return (
    <Form
      onSubmit={(evt) => {
        evt.preventDefault();
        createVehicle({ description, licenseplate });
      }}
    >
      <Form.Group controlId="licenseplate">
        <Form.Label>{t("pages:create_vehicle.licenseplate.label")}</Form.Label>
        <Form.Control
          max="32"
          required
          type="text"
          value={licenseplate}
          onChange={(e) => setLicenseplate(e.target.value)}
        />
        <Form.Text className="text-muted">
          {t("pages:create_vehicle.licenseplate.hint")}
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>{t("pages:create_vehicle.description.label")}</Form.Label>
        <Form.Control
          max="200"
          required
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Form.Text className="text-muted">
          {t("pages:create_vehicle.description.hint")}
        </Form.Text>
      </Form.Group>

      <Button type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" /> : "Create"}
      </Button>
    </Form>
  );
};

export default VehicleForm;
