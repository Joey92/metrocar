import { Container } from "react-bootstrap";
import Footer from "../Footer";
import NavBar from "../NavBar";

const Standard = ({ children }: { children?: any }) => {
  return (
    <>
      <NavBar />
      <Container
        className="content"
        style={{ minHeight: "80vh", padding: 0, marginTop: ".75rem" }}
      >
        <main>{children}</main>
      </Container>
      <Footer />
    </>
  );
};

export default Standard;
