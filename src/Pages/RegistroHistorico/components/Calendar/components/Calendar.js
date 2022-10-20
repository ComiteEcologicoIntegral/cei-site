import React, { useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Accordion, Card } from "react-bootstrap";
import {
  populateDateRange,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  isSameDay,
} from "../../../../../utils/PopulateDateRange";
import Calendar from "react-calendar";
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
function Calendario({ data, gas, selectedDate, datesOfTheMonth, setSelectedDate, dataHM, downloadFile }) {
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

  const [hourCards, setHoursCards] = useState([]);
  const [dayCount, setDayCount] = useState(null);

  useEffect(() => {
    let tmpDayCount = {
      Good: 0,
      Acceptable: 0,
      Bad: 0,
      SuperBad: 0,
      ExtremelyBad: 0,
    };

    datesOfTheMonth.forEach((date) => {
      let status = getDateStatus(date);
      tmpDayCount[status]++;
    });

    setDayCount(tmpDayCount);
  }, [datesOfTheMonth, dataHM]);

  function getDateStatus(date) {
    if (!dataHM || date.getDate() >= dataHM.length) return;
    const dayAverage = dataHM[date.getDate()].prom;
    if (dayAverage < 0) {
      return "NoData";
    }
    if (dayAverage < criteria["Aire y Salud"][gas][0]) {
      return "Good";
    }
    if (dayAverage < criteria["Aire y Salud"][gas][1]) {
      return "Acceptable";
    }
    if (dayAverage < criteria["Aire y Salud"][gas][2]) {
      return "Bad";
    }
    if (dayAverage < criteria["Aire y Salud"][gas][3]) {
      return "Super-bad";
    }
    if (dayAverage > criteria["Aire y Salud"][gas][3]) {
      return "Extremly-bad";
    }
  }

  const statusClassName = {
    Good: "good",
    Acceptable: "acceptable",
    Bad: "bad",
    SuperBad: "super-bad",
    ExtremelyBad: "extremly-bad",
    NoData: "no-data",
  };

  const getDateClassName = useCallback(
    (date) => {
      let dayStatus = getDateStatus(date);
      if (dayStatus !== undefined) {
        return statusClassName[dayStatus];
      }
      return "no-data";
    },
    [dataHM]
  );

  useEffect(() => {
    if (!data || data.length === 0) return;

    let ans = [];

    for (let currHour = 0; currHour < 24 && currHour < data.length; currHour++) {
      ans.push(
        <Accordion key={data[currHour].Registros_id} id={data[currHour].Registros_id}>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Button}
                className="hora"
                variant="link"
                eventKey={data[currHour].Registros_id}
              >
                <AiFillCaretDown color="lightgray" /> {currHour.toString().padStart(2, 0)}:00
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={data[currHour].Registros_id}>
              <Card.Body>
                <p key={currHour}>
                  <AiFillRightSquare className={colorIndice(data[currHour][gas])} />
                  {data[currHour]["zona"]}
                  {data[currHour][gas]
                    ? ` ${data[currHour][gas]} ${unidad[gas]}`
                    : " No hay registro"}
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    }
    setHoursCards(ans);
  }, [data]);

  let firstColumn = hourCards.slice(0, 12);
  let secondColumn = hourCards.slice(12, 24);

  const tileClassName = useCallback(
    ({ date, view }) => {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesOfTheMonth.find((dDate) => isSameDay(dDate, date))) {
        return getDateClassName(date);
      } else {
        return "out-of-range";
      }
    },
    [datesOfTheMonth, getDateClassName]
  );

  return (
    <div className="container mb-10">
      <Row className="mb-5">
        <Col sm={12} lg={6}>
          <div>
            <div className="detalles">
              <p>
                Detalle por hora del día{" "}
                <span className="current-day">{selectedDate.toLocaleDateString("es-MX", dateFormat)}</span>
              </p>
              {data && data.length > 0 ? (
                <div className="d-flex justify-content-evenly">
                  {firstColumn.length > 0 && <div>{firstColumn}</div>}
                  {secondColumn.length > 0 && <div>{secondColumn}</div>}
                </div>
              ) : (
                "No hay datos para este día"
              )}
            </div>
          </div>
        </Col>
        <Col className="calendar-container" sm={12} lg={6}>
          <Calendar onChange={setSelectedDate} value={selectedDate} tileClassName={tileClassName} />
          {dayCount && (
            <div className="day-count">
              <h4 className="mt-4">Conteo de días</h4>
              <DayBullet count={dayCount.Good} text="Buena" type={statusClassName.Good} />
              <DayBullet
                count={dayCount.Acceptable}
                text="Aceptable"
                type={statusClassName.Acceptable}
              />
              <DayBullet count={dayCount.Bad} text="Mala" type={statusClassName.Bad} />
              <DayBullet
                count={dayCount.SuperBad}
                text="Muy mala"
                type={statusClassName.SuperBad}
              />
              <DayBullet
                count={dayCount.ExtremelyBad}
                text="Extremadamente mala"
                type={statusClassName.ExtremelyBad}
              />
            </div>
          )}
        </Col>
      </Row>
      <Button className="btn mt-4" onClick={downloadFile}>
        Descargar datos del mes
      </Button>
    </div>
  );
}

export default Calendario;
