import React, { useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Accordion, Card } from "react-bootstrap";
import {
  populateDateRange,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  isSameDay,
} from "../../../../../utils/PopulateDateRange";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { AiFillCaretDown, AiFillRightSquare } from "react-icons/ai";
import { criteria, getStatus } from "../../../../../handlers/statusCriteria";
import "./Calendar.css";
import "./DayBullet.css";

const currentMonth = new Date().getMonth();
const currentYear = new Date().getUTCFullYear();

const beginOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
const endOfMonth = getLastDayOfMonth(currentYear, currentMonth);

const dateFormat = { weekday: "long", month: "short", day: "numeric", year: "numeric" };

const DayBullet = (props) => {
  const { count, text, type } = props;
  return (
    <div className="day-bullet">
      <div className={`count ${type}`}>{count}</div>
      <div className="text">{text}</div>
    </div>
  );
};

const unidad = {
  PM25: "µg/m3",
  PM10: "µg/m3",
  CO: "ppm",
  O3: "ppm",
  NO2: "ppm",
  SO2: "ppm",
};

// Valores para los dropdowns:
const meses = [
  { value: "1", label: "enero" },
  { value: "2", label: "febrero" },
  { value: "3", label: "marzo" },
  { value: "4", label: "abril" },
  { value: "5", label: "mayo" },
  { value: "6", label: "junio" },
  { value: "7", label: "julio" },
  { value: "8", label: "agosto" },
  { value: "9", label: "septiembre" },
  { value: "10", label: "octubre" },
  { value: "11", label: "noviembre" },
  { value: "12", label: "diciembre" },
];

const anios = [
  { value: "2018", label: "2018" },
  { value: "2019", label: "2019" },
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
];

// Componente para la página de Registro Histórico
function Calendario({ data, gas, setSelectedDate, dataHM, downloadFile }) {
  /* 
        Parámetros:
            - q : query creado en los filtros
            - create: función para crear query
            - data: datos para mostrar en el desglose de horas
            - indi: gas seleccionado en los filtros
            - setDesde: función para cambiar el State de la fecha de inicio para pedir los datos
            - setHasta: función para cambiar el State de la fecha fin
            - downloadFile: función para descargar los datos mostrados
    */

  // Función para obtener la clase a la que pertenece según la medida
  // Dicha clase es para darle el color según el nivel de riesgo
  function colorIndice(medida) {
    let val = getStatus(gas, medida);

    switch (val) {
      case 0:
        return "bueno";
      case 1:
        return "acept";
      case 2:
        return "mala";
      case 3:
        return "muymala";
      case 4:
        return "extmala";
      default:
        return "no-data";
    }
  }

  // Datos calendario
  const [value, onChange] = useState(new Date());
  const [datesOfTheMonth, setMonthDates] = useState(populateDateRange(beginOfMonth, endOfMonth));

  useEffect(() => {
    const currentMonth = datesOfTheMonth[0].getMonth();
    const currentYear = datesOfTheMonth[0].getUTCFullYear();
    const selectedMonth = value.getMonth();
    const selectedYear = value.getUTCFullYear();

    if (currentMonth !== selectedMonth || currentYear !== selectedYear) {
      setMonthDates(populateDateRange(getFirstDayOfMonth(selectedYear, selectedMonth)));
    }

    setSelectedDate(moment(value));
  }, [value]);

  const getDayStatus = useCallback(
    (date) => {
      if (dataHM && date.getDate() < dataHM.length) {
        const dayAverage = dataHM[date.getDate()].prom;

        if (dayAverage < 0) {
          return "no-data";
        }
        if (dayAverage < criteria["Aire y Salud"][gas][0]) {
          return "good";
        }
        if (dayAverage < criteria["Aire y Salud"][gas][1]) {
          return "acceptable";
        }
        if (dayAverage < criteria["Aire y Salud"][gas][2]) {
          return "bad";
        }
        if (dayAverage < criteria["Aire y Salud"][gas][3]) {
          return "super-bad";
        }
        if (dayAverage > criteria["Aire y Salud"][gas][3]) {
          return "extremly-bad";
        }
      }
      return "no-data";
    },
    [dataHM]
  );

  // Cuando ya se hizo el fetch para traer datos:
  let dataCol1 = [];
  let dataCol2 = [];
  let index = 0;
  let currHour = 0;

  if (data && data.length !== 0) {
    // Primera columna (horas de 00:00 a 11:00)
    while (currHour < 24 && index < data.length) {
      let ch = "T" + currHour.toString().padStart(2, 0) + ":";
      let info = [];

      let firstIndex = index;

      // Junta los datos de la misma hora aunque sean de diferente sensor para ponerlos en un mismo acordión
      while (index < data.length && data[index]["dia"].includes(ch)) {
        // Se crea un p tag con un bullet de color, ubicación, medida registrada y unidad
        info.push(
          <p key={index}>
            <AiFillRightSquare className={colorIndice(data[index][gas])} />
            {data[index]["zona"]}:{" "}
            {data[index][gas] ? ` ${data[index][gas]} ${unidad[gas]}` : " No hay registro"}
          </p>
        );
        index++;
      }

      dataCol1.push(
        <Accordion key={data[firstIndex].Registros_id} id={data[firstIndex].Registros_id}>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Button}
                className="hora"
                variant="link"
                eventKey={data[firstIndex].Registros_id}
              >
                <AiFillCaretDown color="lightgray" /> {currHour.toString().padStart(2, 0)}:00
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={data[firstIndex].Registros_id}>
              <Card.Body>{info}</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );

      currHour++;
    }
  }

  let firstColumn = dataCol1.slice(0, 12);
  let secondColumn = dataCol1.slice(12, 24);

  const tileClassName = useCallback(
    ({ date, view }) => {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (
        datesOfTheMonth.find((dDate) => {
          return isSameDay(dDate, date);
        })
      ) {
        return getDayStatus(date);
      }
    },
    [datesOfTheMonth, getDayStatus]
  );

  return (
    <div className="container mb-10">
      <Row className="mb-5">
        <Col sm={12} lg={6}>
          <div>
            <div className="detalles">
              <p>
                Detalle por hora del día
                <span className="current-day">{value.toLocaleDateString("es-MX", dateFormat)}</span>
              </p>
              {data ? (
                <div className="d-flex justify-content-evenly">
                  {firstColumn.length > 0 && <div>{firstColumn}</div> }
                  {secondColumn.length > 0 && <div>{secondColumn}</div> }
                </div>
              ) : (
                "No hay datos para este día"
              )}
            </div>
          </div>
        </Col>
        <Col sm={12} lg={6}>
          <Calendar onChange={onChange} value={value} tileClassName={tileClassName} />
          <Button className="btn mt-4" onClick={downloadFile}>
            Descargar datos del mes
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Calendario;
