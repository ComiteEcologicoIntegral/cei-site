import React, { useState } from "react";
import { Form, Button, Col, Offcanvas, Container } from "react-bootstrap";
import moment from "moment";
import { BsFillInfoSquareFill } from "react-icons/bs";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function GraphForm({
  endTime,
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
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
          <DateTimePicker onChange={setStartDateTime} value={startDateTime} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Hasta</Form.Label>
          <DateTimePicker onChange={setEndDateTime} value={endDateTime} />
        </Form.Group>
      </Form>
      <hr className="mt-2 mb-4" />
    </Container>
  );
}

export default GraphForm;
