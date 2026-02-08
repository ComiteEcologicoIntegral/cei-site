import { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { fetchNewBackendApiCsvRes } from "../../services/api";
import { getISOStrFromDate } from "../../utils/dateUtils";
import { Col, Container, Row } from "react-bootstrap";

function DownloadData() {
  const [start, onChangeStart] = useState(new Date());
  const [end, onChangeEnd] = useState(new Date());
  const downloadData = () => {
    if (!start || !end) return;
    console.log("start", getISOStrFromDate(start));
    console.log("end", getISOStrFromDate(end));
    fetchNewBackendApiCsvRes("/data", {
      start: getISOStrFromDate(start),
      end: getISOStrFromDate(end),
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col className="d-flex justify-content-center align-items-center">
          <div>
            <p>Start</p>
            <DateTimePicker onChange={onChangeStart} value={start} />
            <p>End</p>
            <DateTimePicker onChange={onChangeEnd} value={end} />
            <div>
              <button onClick={downloadData}>Descargar datos</button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DownloadData;
