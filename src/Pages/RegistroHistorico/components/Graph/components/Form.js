import React  from "react";
import { Form, Button, Col } from "react-bootstrap";
import Select from "react-select";
import moment from "moment";
import { systemOptions, gasesOptions, idBlacklistpriv } from "../../../../../constants";
import useSystemLocations from "../../../../../hooks/useSystemLocations";

// Diferente a la que esta definida en constants porque este debe de decir AireNL/Sinaica junto
// Componente para la página de Registro Histórico
function GraphForm({
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  system,
  gas,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
  setLocation,
  setSystem,
  setGas,
  fetchGraphData,
}) {

  const { locations, contaminants } = useSystemLocations(system?.value, idBlacklistpriv);

  const enforceValidGas = () => {
    setGas(gasesOptions[0]);
  };

  const setSystemValue = (system) => {
    if (gas) {
      enforceValidGas();
    }

    setLocation(null);
    setSystem(system);
  };

  function isEndTimeValid () {
    let selectedTime = moment(endTime, "HH:mm");
    return moment().isBefore(selectedTime);
  }

  return (
    <div className="mt-5">
      <div>
        <div className="mt-3">
          <p>
            Genera gráficas a partir de los registros de la calidad del aire del periodo que desees.
          </p>
          <ol>
            <li>Selecciona los filtros que deseas aplicar.</li>
            <li>Selecciona la fecha inicial y fecha final de la gráfica.</li>
          </ol>
        </div>
      </div>
      <Form className="mb-3">
        <Form.Row className="mb-3 d-flex justify-content-evenly">
          <Col xs={6}>
            <p className="font-weight-bold">Sistema</p>
            <Select
              options={systemOptions}
              value={system}
              placeholder={"Sistema"}
              onChange={setSystemValue}
            />
            <p style={{ fontSize: "0.8rem" }} className="mb-1">
              *Recuerda que el sistema PurpleAir solo tiene disponible el contaminante PM2.5
            </p>
          </Col>
          <Col xs={6}>
            <p className="font-weight-bold">Ubicación</p>
            <Select
              className="mt-1"
              options={locations}
              placeholder={"Ubicación"}
              value={location}
              onChange={(e) => setLocation(e)}
            />
          </Col>
        </Form.Row>
        <Form.Row className="mb-3 d-flex justify-content-between">
          <Col xs={4}>
            <p className="font-weight-bold mb-2">Contaminante</p>
            <Select
              options={contaminants}
              placeholder={"Indicador"}
              value={gas}
              onChange={(e) => setGas(e)}
            />
          </Col>
          <Col xs={4}>
            <p className="font-weight-bold mb-2">Desde</p>
            <div className="d-flex justify-content-between flex-row flex-wrap flex-lg-nowrap">
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
            </div>
          </Col>
          <Col xs={4}>
            <p className="font-weight-bold mb-2">Hasta</p>
            <div className="d-flex justify-content-between flex-row flex-wrap flex-lg-nowrap">
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
            </div>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col className="col-boton">
            <Button
              className="btn-aplicar"
              variant="primary"
              block
              onClick={() => fetchGraphData()}
            >
              Graficar
            </Button>
          </Col>
        </Form.Row>
      </Form>

      <hr className="mt-2 mb-4" />
    </div>
  );
}

export default GraphForm;
