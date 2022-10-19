import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { v4 } from "uuid";
import { apiUrl, unidad } from "../../../../../constants";
import { criteria } from "../../../../../handlers/statusCriteria";
import buildCalendar from "./buildCalendar";
import "./DatePicker.css";

const colors = {
  NoData: "rgb(240, 239, 239)", //N/D
  Good: "rgb(76, 187, 23)",
  Acceptable: "rgb(253, 218, 13)",
  Bad: "rgb(254,90,29)",
  SuperBad: "rgb(238, 75, 43)",
  ExtremelyBad: "rgb(143, 63, 151)",
};

const DayBullet = (props) => {
  const { count, text, type } = props;
  return (
    <div className="day-bullet">
      <div className="count" style={{ backgroundColor: colors[type] }}>
        {count}
      </div>
      <div className="text">{text}</div>
    </div>
  );
};

// Componente para el calendario en la página de Registro Histórico
const DatePicker = ({ ubic, ind, selectedDate, onChange }) => {
  /* 
        Se siguió este tutorial : https://youtu.be/5jRrVqRWqsM
    */

  const [calendar, setCalendar] = useState([]);
  const [dataHM, setDataHM] = useState(null);
  const [dayCount, setDayCount] = useState(null);
  const [series, setSeries] = useState([]);

  // build calendar
  let queryStr = "";
  useEffect(() => {
    setCalendar(buildCalendar(selectedDate));

    if (ubic && selectedDate) {
      // Creamos query, sacando los datos de todo el mes
      queryStr =
        "ubic=" +
        ubic.value +
        "&ind=" +
        ind +
        "&inicio=" +
        selectedDate.clone().startOf("month").format("YYYY-MM-DD") +
        "&fin=" +
        selectedDate.clone().endOf("month").format("YYYY-MM-DD");

      fetch(`${apiUrl}/prom-data?${queryStr}`)
        .then((response) => response.json())
        .then((json) => setDataHM(json))
        .catch((e) => console.log(e));
    }
  }, [selectedDate, ubic]);

  useEffect(() => {
    console.log("outside");
    var tmpSeries = []; // Datos

    if (dataHM && dataHM.length > 0) {
      console.log("here inside");
      /* EJEMPLO DEL FORMATO
        series:[
            {
                name: dataHM[i]["zona"]
                data: [
                    {
                        x: número del día,
                        y: dataHM[i][ind],
                        fecha: dataHM[i][fecha].format("DD-MM-YYYY")
                    }
                ]
            }
        ] */
      let index = 0;
      let dataItem = {};

      // Este codigo de abajo se cambio porque ya no era un array de ubicaciones se cambio solo a una ubicación

      // for (let u = 0; u < ubic.length && dataHM[index]; u++) { // Por cada ubicacion seleccionada se crea una fila del heatmap
      // let currUbic = dataHM[index]["zona"];
      let currUbic = dataHM[index]["zona"];
      let primerDia = new Date(dataHM[index].fecha.replace(/-/g, "/").replace(/T.+/, "")); // primer día registrado de los datos de una ubicacion
      let currDia = 1;

      let seriesItem = {
        name: currUbic,
        data: [],
      };

      // llenar primeros días vacíos si es que los datos del mes no empiezan en el primer día
      while (primerDia.getDate() !== currDia) {
        dataItem.x = currDia;
        dataItem.y = -1;
        seriesItem.data.push({ ...dataItem });
        currDia++;
      }

      // ahora sí hay datos
      while (index < dataHM.length && dataHM[index]["zona"] === currUbic) {
        dataItem.x = currDia;

        // revisa que sí haya un registro de ese dia checando si coincide el número de día
        if (currDia === parseInt(dataHM[index]["fecha"].substring(8))) {
          if (dataHM[index]["prom"] !== "") {
            dataItem.y = dataHM[index]["prom"];
            dataItem.fecha = dataHM[index]["fecha"];
          } else {
            dataItem.y = -1;
          }
          index++;
        } else {
          dataItem.y = -1;
        }

        seriesItem.data.push({ ...dataItem });
        currDia++;
      }

      tmpSeries.push({ ...seriesItem });
      setSeries(tmpSeries);
    }
  }, [dataHM]);

  useEffect(() => {
    let tmpDayCount = {
      Good: 0,
      Acceptable: 0,
      Bad: 0,
      SuperBad: 0,
      ExtremelyBad: 0,
    };

    calendar.forEach((week) => {
      week.forEach((day) => {
        let status = getDayStatus(day);
        tmpDayCount[status]++;
      });
    });

    setDayCount(tmpDayCount);
  }, [series]);

  function isSelected(day) {
    return selectedDate.isSame(day, "day");
  }

  function afterToday(day) {
    return day.isAfter(new Date(), "day");
  }

  function isToday(day) {
    return day.isSame(new Date(), "day");
  }

  function sameMonth(day) {
    return day.isSame(selectedDate, "month");
  }

  function getDayStatus(day) {
    if (series.length !== 0) {
      const x = series[0]["data"][day.format("D") - 1];
      if (typeof x !== "undefined") {
        const y = x["y"];

        if (y < 0) {
          return "NoData";
        }
        if (y < criteria["Aire y Salud"][ind][0]) {
          return "Good";
        }
        if (y < criteria["Aire y Salud"][ind][1]) {
          return "Acceptable";
        }
        if (y < criteria["Aire y Salud"][ind][2]) {
          return "Bad";
        }
        if (y < criteria["Aire y Salud"][ind][3]) {
          return "SuperBad";
        }
        if (y > criteria["Aire y Salud"][ind][3]) {
          return "ExtremelyBad";
        }
      }
    }
    return "NoData";
  }

  function toolTip(day) {
    if (series.length !== 0) {
      const x = series[0]["data"][day.format("D") - 1];
      if (typeof x !== "undefined") {
        const y = x["y"].toFixed(2);
        return y + " " + unidad[ind];
      }
    }
    return "N/D";
  }

  function dayStyles(day) {
    if (isSelected(day)) return "selected";
    if (isToday(day)) return "today";
    if (afterToday(day)) return "after";
    if (!sameMonth(day)) return "month";
    return "";
  }

  function currMonthName() {
    return selectedDate.format("MMM");
  }

  function currYear() {
    return selectedDate.format("YYYY");
  }

  function prevMonth() {
    return selectedDate.clone().subtract(1, "month");
  }

  function nextMonth() {
    return selectedDate.clone().endOf("month").add(1, "day");
  }

  function currMonth() {
    return selectedDate.isSame(new Date(), "month");
  }

  function isFirstMonthRegistered() {
    return selectedDate.isSame(new Date("01-01-2018"), "month");
  }

  return (
    <div className="calendar mt-5">
      <div className="cal-header">
        <Row>
          <Col
            sm={3}
            className="previous"
            onClick={() => !isFirstMonthRegistered() && onChange(prevMonth)}
          >
            {!isFirstMonthRegistered() ? String.fromCharCode(171) : null}
          </Col>
          <Col sm={6} className="current">
            {currMonthName()}, {currYear()}
          </Col>
          <Col sm={3} className="next" onClick={() => !currMonth() && onChange(nextMonth)}>
            {!currMonth() ? String.fromCharCode(187) : null}
          </Col>
        </Row>
      </div>
      <div className="body">
        <div className="day-names">
          {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
            <div className="weekday" key={i}>
              {d}
            </div>
          ))}
        </div>
        {calendar.map((week, w) => (
          <div key={w}>
            {week.map((day, i) => (
              <div className="day" onClick={() => !afterToday(day) && onChange(day)}>
                <div
                  className={dayStyles(day)}
                  style={{
                    backgroundColor: colors[getDayStatus(day)],
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  key={v4()}
                >
                  {day.format("D")}
                  <span>{toolTip(day)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {dayCount && (
        <div className="footer">
          <DayBullet count={dayCount.Good} text="Buena" type="Good" />
          <DayBullet count={dayCount.Acceptable} text="Aceptable" type="Acceptable" />
          <DayBullet count={dayCount.Bad} text="Mala" type="Bad" />
          <DayBullet count={dayCount.SuperBad} text="Muy mala" type="SuperBad" />
          <DayBullet count={dayCount.ExtremelyBad} text="Extremadamente mala" type="ExtremelyBad" />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
