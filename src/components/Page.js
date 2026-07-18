import { useState } from "react";
import { Button, Container, Offcanvas } from "react-bootstrap";
import Help from "../Pages/Concepts";
import Recomendaciones from "./Recomendaciones";

function Page({ children, pageTitle, infoTitle, infoDesc }) {
  const [show, setShow] = useState(false);
  return (
    <Container fuild>
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{infoTitle}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {infoDesc}
          <br/>
          <Recomendaciones />
          <br/>
          <Help />
        </Offcanvas.Body>
      </Offcanvas>
      <div className="d-flex mt-3">
        <h1 style={{ textTransform: "initial" }}>{pageTitle}</h1>
        <Button variant="outline-info p-0 m-1" onClick={() => setShow(true)}>
          Info
        </Button>
      </div>
      <div>{children}</div>
    </Container>
  );
}

export default Page;
