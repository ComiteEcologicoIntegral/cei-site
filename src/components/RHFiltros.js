import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { Form, Row, ButtonGroup, Button, Col, ToggleButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchSummaryData } from "../handlers/data";
import { setSensorData } from "../redux/reducers";
import { indicadores, idBlacklistpriv } from "../constants";

// Diferente a la que esta definida en constants porque este debe de decir AireNL/Sinaica junto
const systemOptions = [
  { value: "PurpleAir", label: "PurpleAir", opt: "P" },
  { value: "AireNuevoLeon", label: "AireNuevoLeon/Sinaica", opt: "G" },
];

// Componente para la página de Registro Histórico
function RHFiltros({
  createQueryGraph,
  createQueryCal,
  radioValue,
  setRadioValue,
  updateMainFiltros,
  startDate,
  endDate,
  startTime,
  endTime,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
}) {
  /*
        Parámetros:
            - createQueryGraph: función para crear query de la gráfica
            - createQueryCal: función para crear query del calendario
            - radioValue: sección seleccionada
            - setRadioValue: función para cambiar el radioValue
            - updateMainFiltros: función para updatear en el componente padre los inputs seleccionados
    */

  const radios = [
    { name: "Grafica", value: "1" },
    { name: "Calendario", value: "2" },
  ];

  const dispatch = useDispatch();
  const { sensorDataLastUpdate, sensorData } = useSelector((state) => state);
  const [date, setDate] = useState(Date());

  const [sensRaw, setSensRaw] = useState(null);
  let sensores = [];

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
  }, [sensorDataLastUpdate, dispatch, sensorData]);

  const urlParams = new URLSearchParams(window.location.search);

  // Get system
  let selectedSystemValue = urlParams.get("system") === "G" ? systemOptions[1] : systemOptions[0];

  // Get location
  let locationString = urlParams.get("location");
  let selectedLocation = null;
  if (locationString !== null) {
    selectedLocation = { value: "", label: locationString };
  }

  // Get gas
  let selectedGas = indicadores.find((indicador) => {
    return indicador.value === urlParams.get("gas");
  });
  if (selectedGas == null) {
    selectedGas = indicadores[0];
  }

  // Get start and end dates
  let dateFormat = "MM/DD/YYYY/HH:MM:SS";
  moment(urlParams.get("start_date"), dateFormat).toDate();
  moment(urlParams.get("end_date"), dateFormat).toDate();

  const [system, setSystem] = useState(selectedSystemValue);
  const [indOptions, setIndOptions] = useState(indicadores);
  const [indicador, setIndicador] = useState(selectedGas);
  const sistema = useRef(selectedSystemValue);

  const [location, setLocation] = useState(selectedLocation);
  const ubicacion = useRef(selectedLocation);

  // Crear valores para el dropdown
  if (sensRaw) {
    sensRaw.forEach((element) => {
      if (system.value === element.Sistema && !idBlacklistpriv.includes(element.Sensor_id)) {
        sensores.push({ value: element.Sensor_id, label: element.Zona });
      }
    });
  }

  // Función general para crear el query
  function createQuery() {
    updateMainFiltros(ubicacion.current, indicador, sistema.current); // Actualiza los valores de los filtros en el componente padre
    if (radioValue === "1") {
      createQueryGraph();
    } else {
      createQueryCal();
    }
  }

  // Funcion para revisar si el contaminante seleccionado es valido en el sistema
  const enforceValidGas = (value) => {
    if (value.label === "PurpleAir" && indicador.value !== "PM25") {
      setIndicador(indicadores[0]);
    }
  };

  return (
    <div className="mt-5">
      <div className="ta-center mb-5">
        <h2>Registro Histórico</h2>
        <p>Consulta los datos históricos de la calidad del aire</p>
      </div>
      <ButtonGroup toggle style={{ width: "100%" }}>
        {radios.map((radio, idx) => (
          <ToggleButton
            className="toggle-vista"
            key={idx}
            type="radio"
            variant="light"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <div>
        {radioValue === "1" && (
          <div className="mt-3">
            <p>
              Genera gráficas a partir de los registros de la calidad del aire del periodo que
              desees.
            </p>
            <ol>
              <li>Selecciona los filtros que deseas aplicar.</li>
              <li>Selecciona la fecha inicial y fecha final de la gráfica.</li>
            </ol>
          </div>
        )}
        {radioValue === "2" && (
          <div className="mt-3">
            <p>Consulta y descarga los registros mensuales de la calidad del aire.</p>
            <ol>
              <li>Selecciona los filtros que deseas aplicar.</li>
              <li>Selecciona el mes que desea conultar.</li>
            </ol>
          </div>
        )}
      </div>
      <Form className="mb-3">
        <Form.Row className="mb-3 d-flex justify-content-evenly">
          <Col xs={6}>
            <p className="font-weight-bold">Sistema</p>
            <Select
              options={systemOptions}
              value={system}
              placeholder={"Sistema"}
              onChange={(value) => {
                enforceValidGas(value);
                setLocation(null);
                ubicacion.current = null;
                sistema.current = value;
                setSystem(value);
                system.value === "PurpleAir"
                  ? setIndOptions([indicadores[0]])
                  : setIndOptions(indicadores);
              }}
            />
            <p style={{ fontSize: "0.8rem" }} className="mb-1">
              *Recuerda que el sistema PurpleAir solo tiene disponible el contaminante PM2.5
            </p>
          </Col>
          <Col xs={6}>
            <p className="font-weight-bold">Ubicación</p>
            <Select
              className="mt-1"
              options={sensores}
              value={location}
              placeholder={"Ubicación"}
              onChange={(value) => {
                setLocation(value);
                ubicacion.current = value;
              }}
            />
          </Col>
        </Form.Row>
        <Form.Row className="mb-3 d-flex justify-content-between">
          <Col xs={4}>
            <p className="font-weight-bold mb-2">Contaminante</p>
            <Select
              options={indOptions}
              placeholder={"Indicador"}
              onChange={setIndicador}
              value={indicador}
            />
          </Col>
          <Col xs={4}>
            <p className="font-weight-bold mb-2">Desde</p>
            <div className="d-flex justify-content-between flex-row">
              <Form.Control
                type="date"
                required
                value={moment(startDate).format("yyyy-MM-DD")}
                onChange={(event) => setStartDate(moment(event.target.value))}
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
            <div className="d-flex justify-content-between flex-row">
              <Form.Control
                type="date"
                required
                value={moment(endDate).format("yyyy-MM-DD")}
                onChange={(event) => setEndDate(event.target.value)}
              ></Form.Control>
              <Form.Control
                value={endTime}
                onChange={(event) => setEndTime(event.target.value + ":00")}
                type="time"
              ></Form.Control>
            </div>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col className="col-boton">
            <Button className="btn-aplicar" variant="primary" block onClick={() => createQuery()}>
              Graficar
            </Button>
          </Col>
        </Form.Row>
      </Form>

      <hr className="mt-2 mb-4" />
    </div>
  );
}

export default RHFiltros;
