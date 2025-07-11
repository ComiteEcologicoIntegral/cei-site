/**
 * index.js
 * 
 * This component is responsible for the air quality calendar section in the application UI.
 * It integrates user filters, fetches and displays monthly and hourly quality data, 
 * and enables users to download records for the selected period. 
 * 
 * Features: 
 * - Select a location and pollutant.
 * - Download monthly data as CSV.
 * - Visualize hourly data for a selected day.
 * - View daily air quality data in a calendar format.
 * - Filter by location and pollutant 
 * 
 * Dependencies: 
 * - React (useState , useEffect)
 * - Redux: retrieve selected location 
 * - moment.js (date formatting and manipulation)
 * - Custom utility functions for date generation 
 *
 * Last update:[?]
 */


//React and hooks
import React, { useState, useEffect } from "react";

//moment.js for date manipulation and locale configuration 
import moment from "moment";
import "moment/locale/es";

//UI components
import { Button, Container, Offcanvas, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";

//Custom components and utility functions for date calculations
import Calendar from "./components/Calendar";
import {
  populateDateRange,
  getFirstDayOfMonth,
  getDateLastDayOfMonth,
  getFirstAndLastDayOfMonth
} from "../../utils/PopulateDateRange";
import { getDayHourlyData, getMonthAverage } from "../../services/dayAverageService";
import HourlyData from "./components/HourlyData";

//Constants and redux hooks
import { apiUrl, normOptions } from "../../constants";
import { useSelector } from "react-redux";

//Global current date calculations
let currentMonth = new Date().getMonth();
let currentYear = new Date().getUTCFullYear();
let beginOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
let endOfMonth = getDateLastDayOfMonth(currentYear, currentMonth);

//Units for each polluant 
const unidad = {
  PM25: "µg/m3",
  PM10: "µg/m3",
  CO: "ppm",
  O3: "ppm",
  NO2: "ppm",
  SO2: "ppm",
};

function CalendarSection() {
//Global state (Redux)
  const { location, contaminant } = useSelector((state) => state.form);

  const [dataByHour, setDataByHour] = useState(null);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [avgOptions, setAvgOptions] = useState({});

  // Datos de los filtros
  const [avgType, setAvgType] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesOfTheMonth, setMonthDates] = useState(populateDateRange(beginOfMonth, endOfMonth));

  const [calendarData, setCalendarData] = useState(null);

//Update avarage options when contaminant changes 
  useEffect(() => {
    if (!contaminant) return;
    setAvgType(normOptions[contaminant.value][0]);
    setAvgOptions(normOptions[contaminant.value]);
  }, [contaminant]);

  //Fetch data when date is updated 
  useEffect(() => {
    if (location && contaminant) {
      fetchData();
    }
  }, [selectedDate]);

  //Update month range when selected date changes 
  useEffect(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getUTCFullYear();
    beginOfMonth = getFirstDayOfMonth(selectedYear, selectedMonth);
    endOfMonth = getDateLastDayOfMonth(selectedYear, selectedMonth);

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

  //Fetch data when month range changes 
  useEffect(() => {
    if (location && contaminant) {
      fetchData();
    }
  }, [datesOfTheMonth]);

  //Fetch calendar daily data
  const fetchCalendarData = () => {
    const { first, last } = getFirstAndLastDayOfMonth(selectedDate.getUTCFullYear(), selectedDate.getMonth());
    getMonthAverage(location.value.id, contaminant.value, first.toISOString(), last.toISOString(), avgType.value)
      .then((data) => {
        setCalendarData(data);
      }).catch((e) => {
        setError(e);
      });
  };

  const fetchDayHourlyData = () => {
    getDayHourlyData(location.value.id, contaminant.value, selectedDate.toISOString())
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

  //Build query string to download  
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

  //Trigger file download for selected month 
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

  //Data for selected day 
  const dayData = calendarData ? calendarData[selectedDate.getDate() - 1] : {};

  //Component render 
  return (
    <Container fluid>
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>¿Cómo funciona?</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Consulta y descarga los registros mensuales de la calidad del aire.</p>
          <ol>
            <li>Selecciona los filtros que deseas aplicar.</li>
            <li>Selecciona el mes que desea conultar.</li>
          </ol>
          <hr />
          <p>
            Para visualizar la informacion desglosada por hora da click en el dia
            que deseas y los datos se verán en la parte izquierda.</p>
          <p>
            Para cambiar de
            mes puedes usar las flechas de la parte superior o puedes dar click en
            el mes actual y cambiar a la vista de mes (se vuelve a la vista por dia
            haciendo click en un mes).</p>
          <p>
            Al cambiar de mes haz click en un dia de ese
            mes para que se carguen los datos
          </p>
        </Offcanvas.Body>
      </Offcanvas>
      <Row>
        <Col sm={3}>
          <Button variant="outline-info" onClick={() => setShow(true)}>
            info
          </Button>
          <Form>
            <Form.Group>
              <p className="font-weight-bold mb-2">Promedio/Índice</p>
              <Select
                options={avgOptions}
                placeholder={"Promedio de 24 horas"}
                value={avgType}
                onChange={(e) => setAvgType(e)}
              />
            </Form.Group>
          </Form>
          <hr className="mt-2 mb-4" />
          <Calendar
            calendarData={calendarData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            datesOfTheMonth={datesOfTheMonth}
            avgType={avgType}
          />
          <Button variant="dark" onClick={downloadFile}>
            Descargar datos del mes
          </Button>
        </Col>
        <Col>
          <HourlyData
            dayData={dayData}
            selectedDate={selectedDate}
            dataByHour={dataByHour}
            unidad={unidad}
            contaminant={contaminant}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CalendarSection;
