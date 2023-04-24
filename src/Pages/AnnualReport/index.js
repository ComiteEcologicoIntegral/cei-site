import React, {useState, useEffect} from 'react'
import {Form, Col, Button} from "react-bootstrap";
import Select from "react-select";
import {TailSpin} from 'react-loader-spinner';
import {getSensorLocationsBySystem} from '../../handlers/data';
import {populateDateRange, getFirstDayOfMonth, getLastDayOfMonth} from '../../utils/PopulateDateRange';
import {gasesOptions, apiUrl, normOptions} from "../../constants";
import {getICAR} from "../../handlers/statusCriteria";
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
    {value: 2019, label: 2019},
    {value: 2020, label: 2020},
    {value: 2021, label: 2021},
    {value: 2022, label: 2022},
    {value: 2023, label: 2023},
  ];

  // dropdowns
  const [locations, setLocations] = useState([]);
  const [avgType, setAvgType] = useState([]);
  const [month, setMonth] = useState(months[0]);
  const [year, setYear] = useState(years[0]);
  const [monthDates, setMonthDates] = useState([]);
  const [contaminant, setContaminant] = useState(gasesOptions[0]);
  const [monthData, setMonthData] = useState(null);
  const [avgOptions, setAvgOptions] = useState(null);

  // table 
  const [avgTypeTable, setAvgTypeTable] = useState(null);
  const [contaminantTable, setContaminantTable] = useState(null);
  const [monthTable, setMonthTable] = useState(null);
  const [yearTable, setYearTable] = useState(null);

  // helpers
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSensorLocationsBySystem(REPORT_SYSTEM.value).then((data) => {
      setLocations(data);
    });
  }, [])

  // Make the avgType contsistent with the current selected contaminant
  useEffect(() => {
    if (!contaminant) return;
    setAvgType(normOptions[contaminant.value][0]);
    setAvgOptions(normOptions[contaminant.value]);
  }, [contaminant]);

  function getCalendarQueryString(location) {
    let start = getFirstDayOfMonth(year.value, month.value);
    let end = getLastDayOfMonth(year.value, month.value);

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
      "&norm=" +
      avgType.value;

    return queryStr;
  }

  const fetchCalendarData = (location) => {
    // Data for calendar
    let calendarQueryString = getCalendarQueryString(location);
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}/prom-data-norms?${calendarQueryString}`)
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        })
        .catch((e) => reject(e));
    }
    );
  };

  function getDateStatus(date, location) {
    if (!monthData[location.label] || !date || date.getDate() > monthData[location.label].length) return;
    const dayAverage = monthData[location.label][date.getDate() - 1].movil;
    if (dayAverage === "") return;
    let ans = getICAR(dayAverage, contaminantTable.value, avgTypeTable.value);
    return ans;
  }

  const handleClick = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    setMonthData(null);

    const firstDayOfTheMonth = getFirstDayOfMonth(year.value, month.value);
    const lastDayOfTheMonth = getLastDayOfMonth(year.value, month.value);
    const tmpMonthDates = populateDateRange(firstDayOfTheMonth, lastDayOfTheMonth);
    setMonthDates(tmpMonthDates);

    setAvgTypeTable(avgType);
    setContaminantTable(contaminant);
    setMonthTable(month);
    setYearTable(year);

    const promises = [];
    locations.forEach((location) => {
      promises.push(fetchCalendarData(location));
    });


    Promise.all(promises).then((results) => {
      let tmpMonthData = {}
      for (let i = 0; i < results.length; ++i) {
        tmpMonthData[locations[i].label] = results[i];
      }
      setMonthData(tmpMonthData);

      setIsLoading(false);
    });
  }

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
            <p className="font-weight-bold">Año</p>
            <Select
              className="mt-1"
              options={years}
              placeholder={"Año"}
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
          <Col xs={6}>
            <p className="font-weight-bold mb-2">Promedio/Índice</p>
            <Select
              options={avgOptions}
              placeholder={"Promedio de 24 horas"}
              value={avgType}
              onChange={(e) => setAvgType(e)}
            />
          </Col>
        </Form.Row>
        <Button onClick={handleClick} disabled={isLoading}>
          Obtener datos
        </Button>
      </Form>
      {isLoading &&
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      }
      {monthData &&
        <div className="annual-report-table">
          <h4>Tabla para contaminante {contaminantTable.label} con la norma {avgTypeTable.label}. {monthTable.label} {yearTable.label}</h4>
          <table>
            <thead>
              <tr>
                <th>Zona</th>
                {monthDates.map((date) => {
                  return (<th key={date.getDate()}>{date.getDate()}</th>);
                })}
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => {
                if (!monthData) return;
                const monthDataForLocation = monthData[location.label];
                if (!monthDataForLocation) return;
                const dayAvgs = monthDataForLocation.map((data, i) => {
                  return (<td className={getDateStatus(monthDates[i], location)}>{data.movil ? data.movil.toPrecision(4) : "ND"}</td>);
                });
                return (<tr><td>{location.label}</td>{dayAvgs}</tr>);
              }
              )}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}
