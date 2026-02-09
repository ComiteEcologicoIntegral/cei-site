import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { fetchNewBackendApiCsvRes } from "../../services/api";
import { getISOStrFromDate } from "../../utils/dateUtils";
import { Col, Container, Row } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";

function DownloadData() {
  const [loading, setLoading] = useState(false);
  const [start, onChangeStart] = useState(new Date().setHours(0, 0, 0, 0));
  const [end, onChangeEnd] = useState(new Date().setMinutes(0, 0, 0));
  const downloadData = () => {
    if (!start || !end) return;
    setLoading(true);
    fetchNewBackendApiCsvRes("/data", {
      start: getISOStrFromDate(start),
      end: getISOStrFromDate(end),
    }).then(() => setLoading(false));
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
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div>
                <button onClick={downloadData}>Descargar datos</button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DownloadData;
