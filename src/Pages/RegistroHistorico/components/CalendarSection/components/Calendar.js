import React, { useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Accordion, Card } from "react-bootstrap";
import {
  isSameDay,
} from "../../../../../utils/PopulateDateRange";
import ReactCalendar from "react-calendar";
import { AiFillCaretDown, AiFillRightSquare } from "react-icons/ai";
import { getStatusClassName } from "../../../../../handlers/statusCriteria";
import { statusClassName } from "../../../../../constants"
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

function Calendar({ calendarData, dataByHour, gas, selectedDate, setSelectedDate, datesOfTheMonth, downloadFile, avgType }) {

  const [hourCards, setHoursCards] = useState([]);
  const [dayCount, setDayCount] = useState(null);

  useEffect(() => {
    if (!calendarData) return;
    let tmpDayCount = {
      good: 0,
      acceptable: 0,
      bad: 0,
      "super-bad": 0,
      "extremely-bad": 0,
      "no-data":0
    };

    datesOfTheMonth.forEach((date) => {
      if (calendarData[date.getDate() - 1]) {
        let status = getStatusClassName(calendarData[date.getDate() - 1].movil, gas, avgType.value);      
        tmpDayCount[status]++;
      }
    });

    setDayCount(tmpDayCount);
  }, [datesOfTheMonth, calendarData]);


  useEffect(() => {
    if (!dataByHour || dataByHour.length === 0) return;

    let ans = [];

    for (let currHour = 0; currHour < 24 && currHour < dataByHour.length; currHour++) {
      ans.push(
        <Card key={currHour}>
          <Card.Header>
            <Accordion.Toggle
              as={Button}
              className="hora"
              variant="link"
              eventKey={currHour.toString()}
            >
              <AiFillCaretDown color="lightgray" /> {currHour.toString().padStart(2, '0')}:00
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={currHour.toString()}>
            <Card.Body>
              <p>
                <AiFillRightSquare style={{color: "white"}} className={getStatusClassName(dataByHour[currHour][gas], gas, avgType.value)} />
                {dataByHour[currHour][gas]
                  ? ` ${dataByHour[currHour][gas]} ${unidad[gas]}`
                  : " No hay registro"}
              </p>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    }
    setHoursCards(ans);
  }, [dataByHour]);

  const getDateClassName = useCallback(
    (date) => {
      if (!calendarData || !calendarData[date.getDate() - 1] || !avgType.value) { 
        return; 
      }
      return getStatusClassName(calendarData[date.getDate() - 1].movil, gas, avgType.value);
    }, [calendarData]);

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
  
  const dayData = calendarData ? calendarData[selectedDate.getDate() - 1] : null; 
  const dayAverageInfo = <span className={getDateClassName(selectedDate)}>{dayData && dayData.movil ? dayData.movil.toPrecision(5) : "ND"}</span>;
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
          <div className="detalles">
            <p>
              Detalle por hora del día
              <span className="current-day"> {selectedDate.toLocaleDateString("es-MX", dateFormat)} </span>
            </p>
            {calendarData && <p>
              Promedio del día: {dayAverageInfo}
            </p>}
            <Accordion>
              {hourCards}
            </Accordion>
          </div>
        </Col>
        <Col className="calendar-container" sm={12} lg={6}>
          <ReactCalendar
            locale={"es-MX"}
            onChange={(date) => {
              setSelectedDate(date);
            }}
            value={selectedDate}
            tileClassName={tileClassName}
          />
          {dayCount && (
            <div className="day-count">
              <h4 className="mt-4">Conteo de días</h4>
              <DayBullet
                count={dayCount.good}
                text="Buena"
                type={statusClassName.Good}
              />
              <DayBullet
                count={dayCount.acceptable}
                text="Aceptable"
                type={statusClassName.Acceptable}
              />
              <DayBullet
                count={dayCount.bad}
                text="Mala"
                type={statusClassName.Bad}
              />
              <DayBullet
                count={dayCount["super-bad"]}
                text="Muy mala"
                type={statusClassName.SuperBad}
              />
              <DayBullet
                count={dayCount["extremely-bad"]}
                text="Extremadamente mala"
                type={statusClassName.ExtremelyBad}
              />
              <DayBullet
                count={dayCount["no-data"]}
                text="No hay datos"
                type={statusClassName.NoData}
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

export default Calendar;
