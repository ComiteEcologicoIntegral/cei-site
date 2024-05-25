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
  getFirstAndLastDayOfMonth
} from "../../../../utils/PopulateDateRange";
import { getDayHourlyData, getMonthAverage } from "../../../../services/dayAverageService";

let currentMonth = new Date().getMonth();
let currentYear = new Date().getUTCFullYear();
let beginOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
let endOfMonth = getLastDayOfMonth(currentYear, currentMonth);

function CalendarSection() {
  const [dataByHour, setDataByHour] = useState(null);
  const [error, setError] = useState(false);

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

  const fetchCalendarData = () => {
    const { first, last } = getFirstAndLastDayOfMonth(selectedDate.getUTCFullYear(), selectedDate.getMonth());
    getMonthAverage(location.value, contaminant.value, first.toISOString(), last.toISOString(), avgType.value)
      .then((data) => {
        setCalendarData(data);
      }).catch((e) => {
        setError(e);
      });
  };

  const fetchDayHourlyData = () => {
    getDayHourlyData(location.value, contaminant.value, selectedDate.toISOString(), selectedDate.toISOString())
      .then((data) => {
        setDataByHour(data);
      }).catch((e) => {
        setError(e);
      });
  };

  const fetchData = () => {
    fetchCalendarData();
    fetchDayHourlyData();
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
        show={!!error}
        onHide={() => setError(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h5>API error</h5>
        </Modal.Header>
        <Modal.Body>
          <p>{error.message}</p>
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

export default CalendarSection;
