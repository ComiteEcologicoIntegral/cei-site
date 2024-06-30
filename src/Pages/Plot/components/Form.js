import React, { useState } from "react";
import { Form, Button, Col, Offcanvas, Container } from "react-bootstrap";
import moment from "moment";
import { BsFillInfoSquareFill } from "react-icons/bs";

function GraphForm({
  startDate,
  endDate,
  startTime,
  endTime,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
}) {

  const [show, setShow] = useState(false);

  function isEndTimeValid() {
    let selectedTime = moment(endTime, "HH:mm");
    return moment().isBefore(selectedTime);
  }

  return (
    <Container fluid>
      <Button variant="outline-info" onClick={() => setShow(true)}>
        info
      </Button>
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>¿Cómo funciona?</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>
            Genera gráficas a partir de los registros de la calidad del aire del periodo que desees.
          </p>
          <ol>
            <li>Selecciona los filtros que deseas aplicar.</li>
            <li>Selecciona la fecha inicial y fecha final de la gráfica.</li>
          </ol>
        </Offcanvas.Body>
      </Offcanvas>
      <Form className="mb-3">
        <Form.Group>
          <Form.Label>Desde</Form.Label>
          <Form.Control
            type="date"
            required
            value={moment(startDate).format("yyyy-MM-DD")}
            onChange={(event) => setStartDate(moment(event.target.value))}
            isInvalid={moment().isBefore(startDate)}
          ></Form.Control>
          <Form.Control
            value={startTime}
            onChange={(event) => setStartTime(event.target.value + ":00")}
            type="time"
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Hasta</Form.Label>
          <Form.Control
            type="date"
            required
            value={moment(endDate).format("yyyy-MM-DD")}
            onChange={(event) => setEndDate(event.target.value)}
            isInvalid={moment(endDate).isBefore(startDate) || moment().isBefore(endDate)}
          ></Form.Control>

          <Form.Control
            value={endTime}
            onChange={(event) => setEndTime(event.target.value + ":00")}
            type="time"
            isInvalid={isEndTimeValid()}
          ></Form.Control>
        </Form.Group>
      </Form>
      <hr className="mt-2 mb-4" />
    </Container>
  );
}

export default GraphForm;
