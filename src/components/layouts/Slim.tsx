import { Container } from "react-bootstrap";
import Footer from "../Footer";
import NavBar from "../NavBar";

const Slim = ({ children }: { children: any }) => {
  return (
    <>
      <NavBar />
      <Container
        fluid
        className="content"
        style={{ minHeight: "80vh", padding: 0 }}
      >
        <main>{children}</main>
      </Container>
      <Footer />
    </>
  );
};

export default Slim;
