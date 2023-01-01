import React, {useState, useEffect, useCallback} from 'react'
import {Form, Button, Col} from "react-bootstrap";
import Select from "react-select";
import {getSensorLocationsBySystem} from '../../handlers/data';
import { populateDateRange, getFirstDayOfMonth, getLastDayOfMonth, toLocalISOTime } from '../../utils/PopulateDateRange';
import { gasesOptions, apiUrl } from "../../constants";
import { criteria } from "../../handlers/statusCriteria";
import "./index.css";

export default function AnnualReport() {
  const REPORT_SYSTEM = {value: "AireNuevoLeon", label: "AireNuevoLeon/Sinaica", opt: "G"};
const months = [
    {value: 0, label: "Enero"},
    {value: 1, label: "Febrero"},
    {value: 2, label: "Marzo"},
    {value: 3, label: "Abril"},
    {value: 4, label: "Mayo"},
    {value: 5, label: "Junio"},
    {value: 6, label: "Julio"},
    {value: 7, label: "Agosto"},
    {value: 8, label: "Septiembre"},
    {value: 9, label: "Octubre"},
    {value: 10, label: "Noviembre"},
    {value: 11, label: "Diciembre"},
  ];

  const years = [
    {value: 2022, label: 2022},
  ];

  const [locations, setLocations] = useState([]);
  const [month, setMonth] = useState(months[0]);
  const [year, setYear] = useState(years[0]);
  const [monthDates, setMonthDates] = useState([]);
  const [contaminant, setContaminant] = useState(gasesOptions[0]);
  const [monthData, setMonthData] = useState({});

  

  useEffect(() => {
    getSensorLocationsBySystem(REPORT_SYSTEM).then((data) => {
      setLocations(data);
    }); 
  }, [])

  useEffect(() => {
    const currYear = year.value;
    const currMonth = month.value;
    const firstDayOfTheMonth = getFirstDayOfMonth(currYear, currMonth);
    const lastDayOfTheMonth = getLastDayOfMonth(currYear, currMonth);
    const tmpMonthDates = populateDateRange(firstDayOfTheMonth, lastDayOfTheMonth);
    setMonthDates(tmpMonthDates);
  }, [month, year])

  function getCalendarQueryString(location) {
    
    let start = monthDates[0];
    let end = monthDates[monthDates.length - 1];

    let startDateString = start.toISOString().split("T")[0];
    let endDateString = end.toISOString().split("T")[0];

    let queryStr =
      "ubic=" +
      location.value +
      "&ind=" +
      contaminant.value +
      "&inicio=" +
      startDateString +
      "&fin=" +
      endDateString +
      "&norm=semarnat";

    return queryStr;
  }

  const fetchCalendarData = (location) => {
    // Data for calendar
    let calendarQueryString = getCalendarQueryString(location);
    return new Promise((resolve, reject) =>  {
    fetch(`${apiUrl}/prom-data-norms?${calendarQueryString}`)
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((e) => reject(e));
    }
    );
  };

  useEffect( () => {
    const promises = [];
    locations.forEach((location) => {
      promises.push(fetchCalendarData(location));
    });
    setMonthData({});

    Promise.all(promises).then( (results) => {
      let tmpMonthData = {}
      for (let i = 0; i < results.length; ++i) {
        tmpMonthData[locations[i].label] = results[i];
      }
      setMonthData(tmpMonthData);
    });
  }, [monthDates, locations, contaminant]);

  function getDateStatus(date, location) {
    if (!monthData[location.label] || !date || date.getDate() > monthData[location.label].length) return;
    const dayAverage = monthData[location.label][date.getDate()-1].movil;
    if (dayAverage === "") return;
    if (dayAverage < 0) {
      return "NoData";
    }
    if (dayAverage < criteria["semarnat"][contaminant.value][0]) {
      return "Good";
    }
    if (dayAverage < criteria["semarnat"][contaminant.value][1]) {
      return "Acceptable";
    }
    if (dayAverage < criteria["semarnat"][contaminant.value][2]) {
      return "Bad";
    }
    if (dayAverage < criteria["semarnat"][contaminant.value][3]) {
      return "SuperBad";
    }
    if (dayAverage > criteria["semarnat"][contaminant.value][3]) {
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
    (date, location) => {
      let dayStatus = getDateStatus(date, location);
      if (dayStatus !== undefined) {
        return statusClassName[dayStatus];
      }
      return "no-data";
    },
    [monthData]
  );

  return (
    <div>
      <Form className="mb-3">
        <Form.Row className="mb-3 d-flex justify-content-evenly">
          <Col xs={6}>
            <p className="font-weight-bold">Mes</p>
            <Select
              options={months}
              value={month}
              placeholder={"Mes"}
              onChange={(month) => setMonth(month)}
            />
          </Col>
          <Col xs={6}>
            <p className="font-weight-bold">Anio</p>
            <Select
              className="mt-1"
              options={years}
              placeholder={"Anio"}
              value={year}
              onChange={(year) => setYear(year)}
            />
          </Col>
          <Col xs={6}>
            <p className="font-weight-bold">Contaminante</p>
            <Select
              className="mt-1"
              options={gasesOptions}
              placeholder={"Contaminante"}
              value={contaminant}
              onChange={(value) => setContaminant(value)}
            />
          </Col>
        </Form.Row>
      </Form>
      <table>
        <tr>
          <th>Zona</th>
          {monthDates.map((date) => {
            return (<th key={date.getDate()}>{date.getDate()}</th>);
          })}
        </tr>
        {locations.map((location) => {
          if (!monthData) return;
          const monthDataForLocation = monthData[location.label];
          if (!monthDataForLocation) return;
          const dayAvgs = monthDataForLocation.map((data, i) => {
          
            return(<td className={getDateClassName(monthDates[i], location)}>{data.movil ? data.movil.toPrecision(4) : "ND"}</td>);
          });
          return(<tr><td>{location.label}</td>{dayAvgs}</tr>);
        }
        )}
      </table>
    </div>
  );
}
