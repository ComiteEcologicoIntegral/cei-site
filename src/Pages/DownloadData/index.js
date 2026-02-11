import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { fetchNewBackendApiCsvRes } from "../../services/api";
import { getISOStrFromDate } from "../../utils/dateUtils";
import { Button, Col, Container, Offcanvas, Row } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import Page from "../../components/Page";

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

  const [show, setShow] = useState(false);
  return (
    <Page
      pageTitle="Descarga datos históricos"
      infoTitle="Descarga datos históricos"
      infoDesc={
        <>
          <p>Descarga los datos del sistema Aire Nuevo Leon de nuestra base de datos.</p>
          <p>Tenemos datos a partir del 2018.</p>
          <hr/>
          <p>Para obtener datos sigue estos pasos:</p>
          <ol>
            <li>Selecciona la fecha de inicio</li>
            <li>Selecciona la fecha de fin</li>
            <li>Da click en descargar</li>
            <li>Espera unos segundos...Y se descargará un csv con los datos</li>
          </ol>
        </>
      }
    >
      <Row>
        <Col className="d-flex justify-content-center align-items-center">
          <div>
            <p>Fecha de inicio</p>
            <DateTimePicker onChange={onChangeStart} value={start} />
            <p>Fecha de fin</p>
            <DateTimePicker onChange={onChangeEnd} value={end} />
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div>
                <Button variant="primary m-2" onClick={downloadData}>Descargar datos</Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Page>
  );
}

export default DownloadData;
