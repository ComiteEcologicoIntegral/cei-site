import React, { useState, useEffect, Suspense, lazy } from "react";
import GraphForm from "./components/Form";
import Graph from "./components/Graph.js";
import moment from "moment";
import "moment/locale/es";
import { apiUrl } from "../../../../constants";
import { Modal } from "react-bootstrap";

function Index() {
  // http://localhost:3000/location=Garc%C3%ADa&gas=PM25&system=G&start_date=08/02/2022/00:00:00&end_date=08/29/2022/00:00:00
  const [plotData, setPlotData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState(null); // Desplegar mensaje si no se encontraron datos en la BD

  // Datos de los filtros
  const [gas, setGas] = useState(null);
  const [system, setSystem] = useState(null);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [startTime, setStartTime] = useState(moment('00:00', 'HH:mm').format("HH:mm"));
  const [endTime, setEndTime] = useState(moment().format("HH:mm"));
  const [location, setLocation] = useState(null);

  function createQuery() {
    let queryStr = `location=${location.label}&gas=${gas.value}&system=${
      system.opt
    }&start_date=${moment.utc(startDate).format("MM/DD/YYYY")}/${startTime}:00&end_date=${moment
      .utc(endDate)
      .format("MM/DD/YYYY")}/${endTime}:00`;

    return queryStr;
  }

  function validateQueryParams() {
    let invalidParams = [];

    if (!location) {
      invalidParams.push({
        parameter: "Ubicación",
        reason: "Ubicación no seleccionada"
      });
    }
    if (!system) {
      invalidParams.push({
        parameter: "Sistema",
        reason: "Sitema no seleccionado"
      });
    }
    if (!gas) {
      invalidParams.push({
        parameter: "Contaminante",
        reason: "Contaminante no seleccionado"
      });
    }
    if(moment().isBefore(endDate)) {
      invalidParams.push({
        parameter: "Hasta",
        reason: `La fecha 'Hasta' no puede ser despues que hoy ${moment().format("DD MMM YYYY")}`
      });
    }
    if(moment(endDate).isBefore(startDate)) {
      invalidParams.push({
        parameter: "Hasta",
        reason: `La fecha 'Hasta' no puede ser antes que la fecha 'Desde' ${moment(startDate).format("DD MMM YYYY")}`
      });
    }
    if(moment(endTime, "HH:mm") > moment("HH:mm")) {
      alert("hey")
    }

    const areParamsValid = invalidParams.length === 0;

    if (!areParamsValid) {
      setError({
        title: "Revisa los siguientes parametros",
        body: (
          <div>
            <p>Por favor selecciona un valor válido para los siguientes parametros</p>
            <ul>
              {invalidParams.map((param, idx) => (
                <li key={idx}>{param.reason}</li>
              ))}
            </ul>
          </div>
        ),
      });
    }

    return areParamsValid;
  }

  function fetchGraphData() {
    if (!validateQueryParams()) {
      return;
    }

    let queryString = createQuery();

    // Sección gráfica
    fetch(`${apiUrl}/get-graph-opt?${queryString}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("message")) throw "Datos no encontrados";
        // Hacer cambio de horario por la zona horaria
        let fechasArray = [];
        if (json.plot.data) {
          json.plot.data[0].x.forEach((fecha) => {
            let time = moment.duration("05:00:00");
            fecha = moment(fecha).subtract(time).format();
            fechasArray.push(fecha.split("-05:00")[0]);
          });
        }
        json.plot.data[0].x = fechasArray;

        // Hacer más grande el texto de la grafica
        json.plot.layout = { ...json.plot.layout, font: { size: 15 } };
        setPlotData(json.plot);
        setSummaryData(json.summary);
      })
      .catch((e) => {
        setError({
          title: e,
          body: "Intenta de nuevo con otros parámetros",
        });
      });
  }

  function downloadCSV() {
    let queryString = createQuery();

    fetch(`${apiUrl}/download-data?${queryString}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";

        const clickHandler = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener("click", clickHandler);
          }, 150);
        };

        a.addEventListener("click", clickHandler, false);
        a.click();
      });
  }

  return (
    <div className="container mb-10">
      <Modal
        show={error !== null}
        onHide={() => setError(null)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{error && error.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error && error.body}</Modal.Body>
      </Modal>
      <GraphForm
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        location={location}
        system={system}
        gas={gas}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        setLocation={setLocation}
        setSystem={setSystem}
        setGas={setGas}
        fetchGraphData={fetchGraphData}
        downloadCSV={downloadCSV}
      />
      {plotData !== null ? (
        <Graph summary={summaryData} plotData={plotData} downloadCSV={downloadCSV} />
      ) : (
        <div className="w-100 text-center">
          Selecciona un sensor, contaminante y fechas para obtener los datos
        </div>
      )}
    </div>
  );
}

export default Index;
