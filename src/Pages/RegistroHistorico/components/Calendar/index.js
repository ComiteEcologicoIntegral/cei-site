import React, { useState, useEffect, Suspense, lazy } from "react";
import moment from "moment";
import "moment/locale/es";
import Form from "./components/Form";
import { apiUrl } from "../../../../constants";
import { Modal } from "react-bootstrap";
import Calendar from "./components/Calendar";
import {
  populateDateRange,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "../../../../utils/PopulateDateRange";

let currentMonth = new Date().getMonth();
let currentYear = new Date().getUTCFullYear();
let beginOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
let endOfMonth = getLastDayOfMonth(currentYear, currentMonth);

const dateFormat = { day: "numeric", month: "2-digit", year: "numeric" };

function CalendarWrapper() {
  // http://localhost:3000/location=Garc%C3%ADa&gas=PM25&system=G&start_date=08/02/2022/00:00:00&end_date=08/29/2022/00:00:00
  const [calendarData, setCalendarData] = useState(null);
  const [noData, setNoData] = useState(false); // Desplegar mensaje si no se encontraron datos en la BD

  // Datos de los filtros
  const [gas, setGas] = useState(null);
  const [system, setSystem] = useState(null);
  const [location, setLocation] = useState(null);
  const [avgType, setAvgType] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesOfTheMonth, setMonthDates] = useState(populateDateRange(beginOfMonth, endOfMonth));

  const [dataHM, setDataHM] = useState(null);

  useEffect(() => {
    if (location && gas) {
      console.log({ selectedDate });
      fetchData();
    }
  }, [selectedDate]);

  useEffect(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getUTCFullYear();
    beginOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    endOfMonth = getLastDayOfMonth(selectedYear, selectedMonth);
    console.log("here at  the use effect");
    if (datesOfTheMonth && datesOfTheMonth.length !== 0) {
      const currentMonth = datesOfTheMonth[0].getMonth();
      const currentYear = datesOfTheMonth[0].getUTCFullYear();
      if (currentMonth !== selectedMonth || currentYear !== selectedYear) {
        let newMonths = populateDateRange(beginOfMonth, endOfMonth);
        setMonthDates(newMonths);
      }
    } else {
      setMonthDates(populateDateRange(beginOfMonth, endOfMonth));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (location && gas) {
      fetchData();
    }
  }, [datesOfTheMonth]);

  useEffect(() => {
    if (location && gas) {
      fetchDataByHour();
    }
  }, [selectedDate]);

  // Crea el string del query para el calendario
  function createHoursQuery() {
    let queryStr = "ubic=";
    queryStr += location.value;

    queryStr +=
      "&ind=" +
      gas.value +
      "&inicio=" +
      selectedDate.toISOString().split("T")[0] +
      "&fin=" +
      selectedDate.toISOString().split("T")[0];

    return queryStr;
  }

  function createCalendarQuery() {
    currentMonth = selectedDate.getMonth();
    currentYear = selectedDate.getUTCFullYear();
    beginOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    endOfMonth = getLastDayOfMonth(currentYear, currentMonth);

    let startDateString = beginOfMonth.toISOString().split("T")[0];
    let endDateString = endOfMonth.toISOString().split("T")[0];

    let queryStr =
      "ubic=" +
      location.value +
      "&ind=" +
      gas.value +
      "&inicio=" +
      startDateString +
      "&fin=" +
      endDateString;

    return queryStr;
  }

  const fetchCalendarData = () => {
    // Data for calendar
    let calendarQueryString = createCalendarQuery();
    fetch(`${apiUrl}/prom-data?${calendarQueryString}`)
      .then((response) => response.json())
      .then((json) => {
        // console.log("calendar", json);
        setDataHM(json);
      })
      .catch((e) => console.log(e));
  };

  const fetchDataByHour = () => {
    // Data by hour
    let hourQueryString = createHoursQuery();
    fetch(`${apiUrl}/datos-fecha?${hourQueryString}`)
      .then((response) => response.json())
      .then((json) => {
        // console.log("hour", json);
        setCalendarData(json);
      });
  };

  const fetchData = () => {
    fetchCalendarData();
    fetchDataByHour();
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
      <Calendar
        location={location}
        data={calendarData}
        gas={gas ? gas.value : null}
        downloadFile={downloadFile}
        selectedDate={selectedDate}
        datesOfTheMonth={datesOfTheMonth}
        fetchData={fetchData}
        dataHM={dataHM}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

export default CalendarWrapper;
