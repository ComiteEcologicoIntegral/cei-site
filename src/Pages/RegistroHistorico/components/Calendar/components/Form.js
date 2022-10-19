import moment from "moment";
import React, { useState, useEffect } from "react";
import { Form, ButtonGroup, Button, Col, ToggleButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchSummaryData } from "../../../../../handlers/data";
import { setSensorData } from "../../../../../redux/reducers";
import { gasesOptions, idBlacklistpriv } from "../../../../../constants";

// Diferente a la que esta definida en constants porque este debe de decir AireNL/Sinaica junto
const systemOptions = [
  { value: "PurpleAir", label: "PurpleAir", opt: "P" },
  { value: "AireNuevoLeon", label: "AireNuevoLeon/Sinaica", opt: "G" },
];

// Componente para la página de Registro Histórico
function CalendarForm({
  gas,
  system,
  location,
  avgType,
  setLocation,
  setSystem,
  setGas,
  setAvgType,
  search,
}) {
  const dispatch = useDispatch();
  const { sensorDataLastUpdate, sensorData } = useSelector((state) => state);

  const [sensRaw, setSensRaw] = useState(null);

  useEffect(() => {
    // TODO: convertir a hook
    const diff = sensorDataLastUpdate ? moment().diff(sensorDataLastUpdate, "minutes") : 999;

    if (diff > 60) {
      fetchSummaryData()
        .then((data) => {
          dispatch(setSensorData(data));
          setSensRaw(data);
        })
        .catch((err) => console.error(err));
    } else {
      setSensRaw(sensorData);
    }
  }, [sensorDataLastUpdate, sensorData]);

  const [locations, setLocations] = useState([]);
  const [indOptions, setIndOptions] = useState(null);
  const [avgOptions, setAvgOptions] = useState(null);

  const enforceValidGas = () => {
    setGas(gasesOptions[0]);
  };

  const setSystemValue = (system) => {
    enforceValidGas();
    setLocation(null);
    setSystem(system);
  };

  // Crear valores para el dropdown
  useEffect(() => {
    if (!sensRaw || !system) return;

    let sensors = [];
    sensRaw.forEach((element) => {
      if (system.value === element.Sistema && !idBlacklistpriv.includes(element.Sensor_id)) {
        sensors.push({ value: element.Sensor_id, label: element.Zona });
      }
    });

    setLocations(sensors);
    system.value === "PurpleAir" ? setIndOptions([gasesOptions[0]]) : setIndOptions(gasesOptions);
  }, [sensRaw, system]);

  return (
    <div className="mt-5">
      <div>
        <div className="mt-3">
          <p>Consulta y descarga los registros mensuales de la calidad del aire.</p>
          <ol>
            <li>Selecciona los filtros que deseas aplicar.</li>
            <li>Selecciona el mes que desea conultar.</li>
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
        <Form.Row className="mb-3 d-flex justify-content-evenly">
          <Col xs={6}>
            <p className="font-weight-bold mb-2">Contaminante</p>
            <Select
              options={indOptions}
              placeholder={"Indicador"}
              value={gas}
              onChange={(e) => setGas(e)}
            />
          </Col>
          <Col xs={6}>
            <p className="font-weight-bold mb-2">Promedio/Índice</p>
            <Select
              options={avgOptions}
              placeholder={"Tipo de promedio o indice"}
              value={avgType}
              onChange={(e) => setAvgType(e)}
            />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col className="col-boton">
            <Button
              className="btn-aplicar"
              variant="primary"
              block
              onClick={() => search()}
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

export default CalendarForm;
