import React, { useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Accordion, Card } from "react-bootstrap";
import {
  isSameDay,
} from "../../../../../utils/PopulateDateRange";
import ReactCalendar from "react-calendar";
import { AiFillCaretDown, AiFillRightSquare } from "react-icons/ai";
import { criteria, getStatus } from "../../../../../handlers/statusCriteria";
import "./Calendar.css";
import "./DayBullet.css";

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

function Calendario({ calendarData, dataByHour, gas, selectedDate, setSelectedDate, datesOfTheMonth, downloadFile, avgType }) {
  function colorIndice(medida) {
    let val = getStatus(gas, medida, avgType.value);

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
  }, [datesOfTheMonth, calendarData]);

  function getDateStatus(date) {
    if (!calendarData || date.getDate() > calendarData.length) return;
    const dayAverage = calendarData[date.getDate()-1].movil;
    if (dayAverage < 0) {
      return "NoData";
    }
    if (dayAverage < criteria[avgType.value][gas][0]) {
      return "Good";
    }
    if (dayAverage < criteria[avgType.value][gas][1]) {
      return "Acceptable";
    }
    if (dayAverage < criteria[avgType.value][gas][2]) {
      return "Bad";
    }
    if (dayAverage < criteria[avgType.value][gas][3]) {
      return "SuperBad";
    }
    if (dayAverage > criteria[avgType.value][gas][3]) {
      return "ExtremelyBad";
    }
  }

  const statusClassName = {
    Good: "good",
    Acceptable: "acceptable",
    Bad: "bad",
    SuperBad: "super-bad",
    ExtremelyBad: "extremely-bad",
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
    [calendarData]
  );

  useEffect(() => {
    if (!dataByHour || dataByHour.length === 0) return;

    let ans = [];

    for (let currHour = 0; currHour < 24 && currHour < dataByHour.length; currHour++) {
      ans.push(
        <Accordion key={dataByHour[currHour].Registros_id} id={dataByHour[currHour].Registros_id}>
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Button}
                className="hora"
                variant="link"
                eventKey={dataByHour[currHour].Registros_id}
              >
                <AiFillCaretDown color="lightgray" /> {currHour.toString().padStart(2, 0)}:00
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={dataByHour[currHour].Registros_id}>
              <Card.Body>
                <p key={currHour}>
                  <AiFillRightSquare className={colorIndice(dataByHour[currHour][gas])} />
                  {dataByHour[currHour]["zona"]}
                  {dataByHour[currHour][gas]
                    ? ` ${dataByHour[currHour][gas]} ${unidad[gas]}`
                    : " No hay registro"}
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    }
    setHoursCards(ans);
  }, [dataByHour]);

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
      <div className="mb-3">
        Para visualizar la informacion desglosada por hora da click en el dia
        que deseas y los datos se verán en la parte izquierda. Para cambiar de 
        mes puedes usar las flechas de la parte superior o puedes dar click en 
        el mes actual y cambiar a la vista de mes (se vuelve a la vista por dia 
        haciendo click en un mes). Al cambiar de mes haz click en un dia de ese 
        mes para que se carguen los datos
      </div>
      <Row className="mb-5">
        <Col sm={12} lg={6}>
          <div>
            <div className="detalles">
              <p>
                Detalle por hora del día{" "}
                <span className="current-day">
                  {selectedDate.toLocaleDateString("es-MX", dateFormat)}
                </span>
              </p>
              {dataByHour && dataByHour.length > 0 ? (
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
          <ReactCalendar
            locale={"es-MX"}
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
          />
          {dayCount && (
            <div className="day-count">
              <h4 className="mt-4">Conteo de días</h4>
              <DayBullet
                count={dayCount.Good}
                text="Buena"
                type={statusClassName.Good}
              />
              <DayBullet
                count={dayCount.Acceptable}
                text="Aceptable"
                type={statusClassName.Acceptable}
              />
              <DayBullet
                count={dayCount.Bad}
                text="Mala"
                type={statusClassName.Bad}
              />
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
