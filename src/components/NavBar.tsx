import React, { useMemo } from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import Link from "next/link";

import * as actions from "../redux/reducers/user";
import { useTranslation } from "next-i18next";
import Badge from "react-bootstrap/Badge";

import { MdNotifications, MdOutlineMenu } from "react-icons/md";
import { useAction, useAppSelector } from "../store";
import { useRouter } from "next/router";

const NavBar = () => {
  const { t } = useTranslation();

  const { id, notificationAmount, agencies, selectedAgency } = useAppSelector(
    (state) => state.user
  );

  const agencyName = useMemo(
    () =>
      agencies.length > 0 && selectedAgency
        ? agencies.find((a) => a.id! === selectedAgency)?.agency_name
        : undefined,
    [agencies, selectedAgency]
  );

  const selectAgency = useAction(actions.setSelectedAgency);
  const { locale, locales } = useRouter();
  const logout = useAction(actions.logout);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>
            MetroCar <Badge bg="info">Alpha</Badge>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link passHref href="/search">
              <Nav.Link>{t("search")}</Nav.Link>
            </Link>
            {!id && [
              <Link passHref href="/login" key="login">
                <Nav.Link>{t("login")}</Nav.Link>
              </Link>,
              <Link passHref href="/register" key="register">
                <Nav.Link>{t("register")}</Nav.Link>
              </Link>,
            ]}

            {id && [
              <Link passHref href="/my/tickets" key="tickets">
                <Nav.Link>{t("my_tickets")}</Nav.Link>
              </Link>,
              <Link passHref href="/trip/create" key="createTrip">
                <Nav.Link>{t("create_trip")}</Nav.Link>
              </Link>,
            ]}
          </Nav>
          <Nav>
            {id && (
              <>
                {agencyName && agencies.length === 1 && (
                  <Link passHref href="/agency">
                    <Nav.Link>{t("manage_agency")}</Nav.Link>
                  </Link>
                )}
                {agencyName && agencies.length > 1 && (
                  <NavDropdown title={agencyName}>
                    {agencies.map((a) => (
                      <NavDropdown.Item
                        key={a.id}
                        onClick={() => selectAgency(a.id!)}
                      >
                        {a.agency_name}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                )}

                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip>
                      {notificationAmount === 0 && t("no_notifications")}
                      {notificationAmount === 0 &&
                        t("you_have_notifications", {
                          count: notificationAmount,
                        })}
                    </Tooltip>
                  }
                >
                  <Link passHref href="/my/notifications">
                    <Nav.Link>
                      <MdNotifications></MdNotifications>
                      {notificationAmount > 0 && (
                        <Badge>{notificationAmount}</Badge>
                      )}
                    </Nav.Link>
                  </Link>
                </OverlayTrigger>
                <NavDropdown title={<MdOutlineMenu />}>
                  <Link passHref href="/my/profile">
                    <NavDropdown.Item>{t("profile")}</NavDropdown.Item>
                  </Link>
                  <Link passHref href="/my/offers">
                    <NavDropdown.Item>{t("my_offers")}</NavDropdown.Item>
                  </Link>
                  <Link passHref href="/my/tickets">
                    <NavDropdown.Item>{t("my_tickets")}</NavDropdown.Item>
                  </Link>
                  <Link passHref href="/my/radars">
                    <NavDropdown.Item>{t("my_radars")}</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => logout()}>
                    {t("logout")}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
            {!id && (
              <NavDropdown
                title={t(
                  locale
                    ? `languages.${locale.substring(0, 2)}.flag`
                    : "change_language"
                )}
              >
                {locales?.map((lng) => (
                  <Link passHref href={"/"} locale={lng} key={lng}>
                    <NavDropdown.Item>
                      {t(`languages.${lng}.flag`)} {t(`languages.${lng}.name`)}
                    </NavDropdown.Item>
                  </Link>
                ))}
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
