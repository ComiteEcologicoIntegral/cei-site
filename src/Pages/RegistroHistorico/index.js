import React, { useState, useEffect, Suspense, lazy } from "react";
import GraphForm from "./components/GraphForm";
import Grafica from "./components/Grafica";
import moment from "moment";
import "moment/locale/es";
import { apiUrl } from "../../constants";
import { Modal } from "react-bootstrap";
import Calendario from "./components/Calendario";

function Registro() {
  // http://localhost:3000/location=Garc%C3%ADa&gas=PM25&system=G&start_date=08/02/2022/00:00:00&end_date=08/29/2022/00:00:00
  const [plotData, setPlotData] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [radioValue, setRadioValue] = useState("1"); // sección seleccionada (Gráfica/Calendario)
  const [queryString, setQueryString] = useState(null); // string del query

  const [loading, setLoading] = useState(false); // gif
  const [noData, setNoData] = useState(false); // Desplegar mensaje si no se encontraron datos en la BD

  // Datos de los filtros
  const [gas, setGas] = useState(null);
  const [system, setSystem] = useState(null);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState(moment().format("HH:mm").toString()+":00");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (queryString) {
      if (radioValue === "1") {
        let newURL = window.location.origin + window.location.pathname + "?" + queryString;
        window.history.pushState({ path: newURL }, "", newURL);
        // Sección gráfica
        fetch(`${apiUrl}/get-graph-opt?${queryString}`)
          .then((response) => response.json())
          .then((json) => {
            if (json.hasOwnProperty("message")) setNoData(true);
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
            setLoading(false);
          });
      } else {
        // Sección calendario
        fetch(`${apiUrl}/datos-fecha?${queryString}`)
          .then((response) => response.json())
          .then((json) => setCalendarData(json));
      }
    }
  }, [queryString]);

  // Crea el string del query para la gráfica
  function createQueryGraph() {
    if (!location) {
      alert("Selecciona una ubicación.");
      return;
    }
    
    setLoading(true);

    let queryStr = `location=${location.label}&gas=${gas.value}&system=${
      system.opt
    }&start_date=${moment
      .utc(startDate)
      .format("MM/DD/YYYY")}${"/"}${startTime}&end_date=${moment
      .utc(endDate)
      .format("MM/DD/YYYY")}${"/"}${endTime}`;

    console.log(queryStr);

    setQueryString(queryStr);
  }

  // Crea el string del query para el calendario
  function createQueryCal(initialDate, endingDate) {
    // Ejemplo:
    // http://127.0.0.1:8000/datos-fecha?ubic=PA39362&ind=PM25&inicio=2020-10-05&fin=2020-10-06

    // if (!ubicacion.current) {
    //   alert("Selecciona una ubicación.");
    //   return;
    // }
    //
    // if (!initialDate || !endingDate) {
    //   initialDate = startDate;
    //   endingDate = endDate;
    // }
    //
    // let queryStr = "ubic=";
    // queryStr += ubicacion.current.value;
    //
    // queryStr +=
    //   "&ind=" +
    //   gas.current.value +
    //   "&inicio=" +
    //   initialDate.format("YYYY-MM-DD") +
    //   "&fin=" +
    //   endingDate.format("YYYY-MM-DD");
    //
    // setQueryString(queryStr);
  }

  function getQueryStringToDownload() {
    if (queryString) {
      let queryStr = "location=";

      queryStr += location.value;
      if (radioValue === "2") {
        // Para el calendario se descarga todo el mes
        queryStr +=
          "&gas=" +
          gas.current.value +
          "&start_date=" +
          startDate.startOf("month").format("YYYY-MM-DD") +
          "&end_date=" +
          endDate.endOf("month").format("YYYY-MM-DD");
      } else {
        // Para la sección de la gráfica se descarga según las fechas seleccionadas
        queryStr +=
          "&gas=" +
          gas.value +
          "&start_date=" +
          startDate.format("YYYY-MM-DD") +
          "&end_date=" +
          endDate.format("YYYY-MM-DD");
      }

      return queryStr;
    } else {
      return null;
    }
  }

  function downloadFile() {
    let queryStr = getQueryStringToDownload();

    if (queryStr) {
      fetch(`${apiUrl}/download-data?${queryStr}`)
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
  }

  return (
    <div className="container mb-10">
      {/* Sería bueno refactorear esto a un componente */}
      <Modal
        show={noData}
        onHide={() => setNoData(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h5>Datos no encontrados</h5>
        </Modal.Header>
        <Modal.Body>
          <p>Revise los parametros e intente de nuevo.</p>
        </Modal.Body>
      </Modal>
      <GraphForm
        createQueryGraph={createQueryGraph}
        createQueryCal={createQueryCal}
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        location={location}
        setLocation={setLocation}
        system={system}
        setSystem={setSystem}
        gas={gas}
        setGas={setGas}
      />
      <div className="text-center">
        <img
          src="loading.gif"
          alt="Cargando..."
          className="loading"
          style={loading ? {} : { display: "none" }}
        />
      </div>
      {radioValue === "1" &&
        (plotData !== null ? (
          <Grafica downloadFile={downloadFile} summary={summaryData} {...plotData} />
        ) : (
          <div className="w-100 text-center">
            Selecciona un sensor, contaminante y fechas para obtener los datos 
          </div>
        ))}
      {radioValue === "2" && (
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <Calendario
              q={queryString}
              fecha={startDate}
              ubic={location}
              create={createQueryCal}
              data={calendarData}
              gas={gas ? gas.value : null}
              setDesde={setStartDate}
              setHasta={setEndDate}
              downloadFile={downloadFile}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}

export default Registro;
