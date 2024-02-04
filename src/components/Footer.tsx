import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="footer">
      <Container>
        <Row xs="auto" className="justify-content-space-between">
          <Col>
            <span className="header">{t("intresting_pages.label")}</span>
            <ul>
              {(
                t("intresting_pages.links", {
                  returnObjects: true,
                  defaultValue: [],
                }) as []
              ).map(({ link, name }, key) => (
                <li key={key}>
                  <a href={link}>{name}</a>
                </li>
              ))}
            </ul>
          </Col>
          <Col>{t("made_in_berlin")}</Col>
          <Col>
            <span className="header">{t("contact_us.label")}</span>
            <ul>
              {(
                t("contact_us.links", {
                  returnObjects: true,
                  defaultValue: [],
                }) as []
              ).map(({ link, name }, key) => (
                <li key={key}>
                  <a href={link}>{name}</a>
                </li>
              ))}
              <li>
                <Link href="/impress">{t("pages.impress.title")}</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Footer;
