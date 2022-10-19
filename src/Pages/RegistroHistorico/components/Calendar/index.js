import React, { useState, useEffect, Suspense, lazy } from "react";
import moment from "moment";
import "moment/locale/es";
import Form from "./components/Form";
import { apiUrl } from "../../../../constants";
import { Modal } from "react-bootstrap";
import Calendar from "./components/Calendar";

function CalendarWrapper() {
  // http://localhost:3000/location=Garc%C3%ADa&gas=PM25&system=G&start_date=08/02/2022/00:00:00&end_date=08/29/2022/00:00:00
  const [calendarData, setCalendarData] = useState(null);
  const [noData, setNoData] = useState(false); // Desplegar mensaje si no se encontraron datos en la BD

  // Datos de los filtros
  const [gas, setGas] = useState(null);
  const [system, setSystem] = useState(null);
  const [location, setLocation] = useState(null);
  const [avgType, setAvgType] = useState(null);
  
  // Datos calendario
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getUTCFullYear());
  const [selectedDate, setSelectedDate] = useState(moment()); // Valor del día que está seleccionado en el calendario, se inicializa con el dia actual

  useEffect(() => {
    let f = new Date(`${month}/${selectedDate.clone().format("DD")}/${year}`); // Nos colocamos en el primer dia del mes para evitar que al moverte al siguiente mes, se coloque en un día futuro o inexistente
    setSelectedDate(moment(f));
  }, [month, year]); // Cada que cambia un valor de los dropdowns, cambiamos el valor del día seleccionado

  // Crea el string del query para el calendario
  function createQuery(initialDate, endingDate) {
    // Ejemplo:
    // http://127.0.0.1:8000/datos-fecha?ubic=PA39362&ind=PM25&inicio=2020-10-05&fin=2020-10-06

    if (!location) {
      alert("Selecciona una ubicación.");
      return;
    }

    let queryStr = "ubic=";
    queryStr += location.value;

    queryStr +=
      "&ind=" +
      gas.value +
      "&inicio=" +
      initialDate.format("YYYY-MM-DD") +
      "&fin=" +
      endingDate.format("YYYY-MM-DD");

    return queryStr;
  }

  const fetchData = () => {
    let queryString = createQuery(moment(), moment());
    // Sección calendario
    fetch(`${apiUrl}/datos-fecha?${queryString}`)
      .then((response) => response.json())
      .then((json) => {
        console.log({ json });
        setCalendarData(json);
      });
  };

  function getQueryStringToDownload() {
    let queryStr = "location=";

    queryStr += location.value;
    // Para el calendario se descarga todo el mes
    queryStr +=
      "&gas=" +
      gas.value +
      "&start_date=" +
      moment().startOf("month").format("YYYY-MM-DD") +
      "&end_date=" +
      moment().endOf("month").format("YYYY-MM-DD");
    return queryStr;
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
      <Form
        gas={gas}
        system={system}
        location={location}
        avgType={avgType}
        setGas={setGas}
        setSystem={setSystem}
        setLocation={setLocation}
        setAvgType={setAvgType}
        search={fetchData}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Calendar
          location={location}
          data={calendarData}
          gas={gas ? gas.value : null}
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
          downloadFile={downloadFile}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </Suspense>
    </div>
  );
}

export default CalendarWrapper;
