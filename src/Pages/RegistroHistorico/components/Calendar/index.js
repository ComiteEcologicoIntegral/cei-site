import React, { useState, useEffect } from "react";
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
  toLocalISOTime
} from "../../../../utils/PopulateDateRange";

let currentMonth = new Date().getMonth();
let currentYear = new Date().getUTCFullYear();
let beginOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
let endOfMonth = getLastDayOfMonth(currentYear, currentMonth);

function CalendarWrapper() {
  // http://localhost:3000/location=Garc%C3%ADa&gas=PM25&system=G&start_date=08/02/2022/00:00:00&end_date=08/29/2022/00:00:00
  const [dataByHour, setDataByHour] = useState(null);
  const [noData, setNoData] = useState(false); // Desplegar mensaje si no se encontraron datos en la BD

  // Datos de los filtros
  const [system, setSystem] = useState(null);
  const [location, setLocation] = useState(null);
  const [contaminant, setContaminant] = useState(null);
  const [avgType, setAvgType] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesOfTheMonth, setMonthDates] = useState(populateDateRange(beginOfMonth, endOfMonth));

  const [calendarData, setCalendarData] = useState(null);

  useEffect(() => {
    if (location && contaminant) {
      fetchData();
    }
  }, [selectedDate]);

  useEffect(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getUTCFullYear();
    beginOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    endOfMonth = getLastDayOfMonth(selectedYear, selectedMonth);

    // If dates of the month are already populated only repopulate them if selectedMonth or selectedYear have changed
    if (datesOfTheMonth && datesOfTheMonth.length !== 0) {
      const currentMonth = datesOfTheMonth[0].getMonth();
      const currentYear = datesOfTheMonth[0].getUTCFullYear();
      if (currentMonth !== selectedMonth || currentYear !== selectedYear) {
        let newMonthDates = populateDateRange(beginOfMonth, endOfMonth);
        setMonthDates(newMonthDates);
      }
    } else {
      setMonthDates(populateDateRange(beginOfMonth, endOfMonth));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (location && contaminant) {
      fetchData();
    }
  }, [datesOfTheMonth]);

  useEffect(() => {
    if (location && contaminant) {
      fetchDataByHour();
    }
  }, [selectedDate]);

  // Crea el string del query para el calendario
  function getDataByHourQueryString() {

    let currentISOTime = toLocalISOTime(selectedDate).split("T")[0];

    let queryStr = "ubic=" +
      location.value +
      "&ind=" +
      contaminant.value +
      "&inicio=" +
      currentISOTime +
      "&fin=" +
      currentISOTime;

    return queryStr;
  }

  function getCalendarQueryString() {
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
      contaminant.value +
      "&inicio=" +
      startDateString +
      "&fin=" +
      endDateString +
      "&norm=" +
      avgType.value;

    return queryStr;
  }

  const fetchCalendarData = () => {
    // Data for calendar
    let calendarQueryString = getCalendarQueryString();
    fetch(`${apiUrl}/prom-data-norms?${calendarQueryString}`)
      .then((response) => response.json())
      .then((json) => {
        setCalendarData(json);
      })
      .catch((e) => console.log(e));
  };

  const fetchDataByHour = () => {
    // Data by hour
    let hourQueryString = getDataByHourQueryString();
    //console.log("fetching data by hour " + hourQueryString);
    fetch(`${apiUrl}/datos-fecha?${hourQueryString}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setDataByHour(json);
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
      contaminant.value +
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
        contaminant={contaminant}
        system={system}
        location={location}
        avgType={avgType}
        setGas={setContaminant}
        setSystem={setSystem}
        setLocation={setLocation}
        setAvgType={setAvgType}
        search={fetchData}
      />
      <Calendar
        calendarData={calendarData}
        dataByHour={dataByHour}
        gas={contaminant ? contaminant.value : null}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        datesOfTheMonth={datesOfTheMonth}
        downloadFile={downloadFile}
        avgType={avgType}
      />
    </div>
  );
}

export default CalendarWrapper;
