import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import RHFiltros from "./components/RHFiltros";
import Grafica from "./components/Grafica";
import moment from "moment";
import "moment/locale/es";
import { apiUrl } from "./constants";
import { Modal } from "react-bootstrap";
import Recomendaciones from './components/Recomendaciones.js'

const Calendario = lazy(() => import("./components/Calendario")) 

function Registro() {
  const [data, setData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [radioValue, setRadioValue] = useState("1"); // sección seleccionada (Gráfica/Calendario)
  const [queryString, setQueryString] = useState(null); // string del query

  const [loading, setLoading] = useState(false); // gif
  const [noData, setNoData] = useState(false); // Desplegar mensaje si no se encontraron datos en la BD

  // Datos de los filtros:
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [desdeHora, setDesdeHora] = useState("00:00:00");
  const [hastaHora, setHastaHora] = useState("00:00:00");
  const ind = useRef({ value: "PM25" });
  const ubicacion = useRef(null);
  const syst = useRef(null);

  useEffect(() => {
    if (queryString) {
      if (radioValue === "1") {
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
            json.plot.layout = { ...json.plot.layout, font: {size: 15} };

            setData(json.plot);
            setSummaryData(json.summary);
            setLoading(false);
          });
      } else {
        // Sección calendario
        fetch(`${apiUrl}/datos-fecha?${queryString}`)
          .then((response) => response.json())
          .then((json) => setData(json));
      }
    }
  }, [queryString]); // Cada que cambia el string del query creado, hacemos un request al api

  useEffect(() => {
    setData(null);
  }, [radioValue]); // Cuando cambiamos entre Gráfica y Calendario, borramos los datos

  // Esta función es llamada por un componente hijo para actualizar los valores cada que cambian en los filtros
  function updateMainFiltros(u, i, s) {
    syst.current = s;
    ubicacion.current = u;
    ind.current = i;
  }

  // Crea el string del query para la gráfica
  function createQueryGraph() {
    if (!ubicacion.current) {
      alert("Selecciona una ubicación.");
      return;
    }
    if (!desde || !hasta) {
      alert("Selecciona las fechas.");
      return;
    }

    setLoading(true); // Muestra gif de loading

    let queryStr = `location=${ubicacion.current.label}&gas=${
      ind.current.value
    }&system=${syst.current.opt}&start_date=${moment
      .utc(desde)
      .format("MM/DD/YYYY")}${"/"}${desdeHora}&end_date=${moment
      .utc(hasta)
      .format("MM/DD/YYYY")}${"/"}${hastaHora}`;

    setQueryString(queryStr);
  }

  // Crea el string del query para el calendario
  function createQueryCal(initialDate, endingDate) {
    // Ejemplo:
    // http://127.0.0.1:8000/datos-fecha?ubic=PA39362&ind=PM25&inicio=2020-10-05&fin=2020-10-06

    if (!ubicacion.current) {
      alert("Selecciona una ubicación.");
      return;
    }

    if (!initialDate || !endingDate) {
      initialDate = desde;
      endingDate = hasta;
    }

    let queryStr = "ubic=";
    queryStr += ubicacion.current.value;

    queryStr +=
      "&ind=" +
      ind.current.value +
      "&inicio=" +
      initialDate.format("YYYY-MM-DD") +
      "&fin=" +
      endingDate.format("YYYY-MM-DD");

    setQueryString(queryStr);
  }

  function getQueryStringToDownload() {
    if (queryString) {
      let queryStr = "location=";

      queryStr += ubicacion.current.value;
      if (radioValue === "2") {
        // Para el calendario se descarga todo el mes
        queryStr +=
          "&gas=" +
          ind.current.value +
          "&start_date=" +
          desde.startOf("month").format("YYYY-MM-DD") +
          "&end_date=" +
          hasta.endOf("month").format("YYYY-MM-DD");
      } else {
        // Para la sección de la gráfica se descarga según las fechas seleccionadas
        queryStr +=
          "&gas=" +
          ind.current.value +
          "&start_date=" +
          desde.format("YYYY-MM-DD") +
          "&end_date=" +
          hasta.format("YYYY-MM-DD");
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
      <RHFiltros
        createQueryGraph={createQueryGraph}
        createQueryCal={createQueryCal}
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        updateMainFiltros={updateMainFiltros}
      />
      <div className="text-center">
        <img
          src="loading.gif"
          alt="Cargando..."
          className="loading"
          style={loading ? {} : { display: "none" }}
        />
      </div>
      {radioValue === "1" && (
        <Grafica
          setDesde={setDesde}
          setHasta={setHasta}
          setDesdeHora={setDesdeHora}
          setHastaHora={setHastaHora}
          downloadFile={downloadFile}
          summary={summaryData}
          {...data}
        />
      )}
      {radioValue === "2" && (
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <Calendario
              q={queryString}
              fecha={desde}
              ubic={ubicacion.current}
              create={createQueryCal}
              data={data}
              indi={ind.current.value}
              setDesde={setDesde}
              setHasta={setHasta}
              downloadFile={downloadFile}
            />
          </Suspense>
        </>
      )}
      <Recomendaciones selected = 'buena' isManual={true}/>
    </div>
  );
}

export default Registro;
