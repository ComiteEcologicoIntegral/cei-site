import React, { useState, useEffect } from 'react'
import { Form, Col, Button } from "react-bootstrap";
import Select from "react-select";
import { TailSpin } from 'react-loader-spinner';
import { populateDateRange, getFirstDayOfMonth, getLastDayOfMonth, getFirstAndLastDayOfMonth } from '../../utils/PopulateDateRange';
import { gasesOptions, apiUrl, normOptions, idBlacklistpriv } from "../../constants";
import { getICAR } from "../../handlers/statusCriteria";
import "./index.css";
import moment from 'moment';
import useSystemLocations from '../../hooks/useSystemLocations';
import { getMonthAverage } from '../../services/dayAverageService';

export default function AnnualReport() {
  const system = { value: "AireNuevoLeon", label: "AireNuevoLeon/Sinaica", opt: "G" };

  const months = [
    { value: 0, label: "Enero" },
    { value: 1, label: "Febrero" },
    { value: 2, label: "Marzo" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Mayo" },
    { value: 5, label: "Junio" },
    { value: 6, label: "Julio" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Septiembre" },
    { value: 9, label: "Octubre" },
    { value: 10, label: "Noviembre" },
    { value: 11, label: "Diciembre" },
  ];

  const years = generateYearOptions();

  function generateYearOptions() {
    const result = [];
    for (let i = 2019; i <= new moment().year(); i++) {
      result.push({ value: i, label: i });
    }
    return result;
  }

  // dropdowns
  const [avgType, setAvgType] = useState([]);
  const [month, setMonth] = useState(months[0]);
  const [year, setYear] = useState(years[0]);
  const [monthDates, setMonthDates] = useState([]);
  const [contaminant, setContaminant] = useState(gasesOptions[0]);
  const [monthData, setMonthData] = useState(null);
  const [avgOptions, setAvgOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { locations } = useSystemLocations(system.value, idBlacklistpriv);

  // Make the avgType contsistent with the current selected contaminant
  useEffect(() => {
    if (!contaminant) return;
    setAvgType(normOptions[contaminant.value][0]);
    setAvgOptions(normOptions[contaminant.value]);
  }, [contaminant]);

  const fetchCalendarData = (location) => {
    const { first, last } = getFirstAndLastDayOfMonth(year.value, month.value);
    return getMonthAverage(location.value, contaminant.value, first.toISOString(), last.toISOString(), avgType.value);
  };

  const handleClick = () => {
    setIsLoading(true);

    setMonthData(null);

    const firstDayOfTheMonth = getFirstDayOfMonth(year.value, month.value);
    const lastDayOfTheMonth = getLastDayOfMonth(year.value, month.value);
    const tmpMonthDates = populateDateRange(firstDayOfTheMonth, lastDayOfTheMonth);
    setMonthDates(tmpMonthDates);

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
          <h4>Tabla para contaminante {contaminant.label} con la norma {avgType.label}. {month.label} {year.label}</h4>
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
                const locMonthlyData = monthData[location.label];
                const dayAvgs = locMonthlyData.map((data, i) => {
                  return (
                    <td className={data.status}>
                      {data.average ? data.average.toPrecision(4) : "ND"}
                    </td>);
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
