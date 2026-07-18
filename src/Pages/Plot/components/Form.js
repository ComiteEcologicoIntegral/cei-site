import { Form, Container } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

function GraphForm({
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
}) {
  return (
    <Container fluid>
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
