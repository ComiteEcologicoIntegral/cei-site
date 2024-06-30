import React, { useState, useEffect } from 'react'
import Select from "react-select";
import { TailSpin } from 'react-loader-spinner';
import { populateDateRange, getFirstDayOfMonth, getLastDayOfMonth, getFirstAndLastDayOfMonth } from '../../utils/PopulateDateRange';
import { gasesOptions, apiUrl, normOptions, idBlacklistpriv } from "../../constants";
import { getICAR } from "../../handlers/statusCriteria";
import "./index.css";
import moment from 'moment';
import useSystemLocations from '../../hooks/useSystemLocations';
import { getMonthAverage } from '../../services/dayAverageService';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

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
  const [avgType, setAvgType] = useState();
  const [month, setMonth] = useState(months[0].value);
  const [year, setYear] = useState(years[0].value);
  const [monthDates, setMonthDates] = useState([]);
  const [contaminant, setContaminant] = useState(gasesOptions[0].value);
  const [monthData, setMonthData] = useState(null);
  const [avgOptions, setAvgOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { locations } = useSystemLocations(system.value);

  // Make the avgType contsistent with the current selected contaminant
  useEffect(() => {
    if (!contaminant) return;
    setAvgType(normOptions[contaminant][0].value);
    setAvgOptions(normOptions[contaminant]);
  }, [contaminant]);

  const fetchCalendarData = (location) => {
    console.log('avgType', avgType);
    const { first, last } = getFirstAndLastDayOfMonth(year, month);
    return getMonthAverage(location.value.id, contaminant, first.toISOString(), last.toISOString(), avgType);
  };

  const handleClick = () => {
    setIsLoading(true);

    setMonthData(null);

    const firstDayOfTheMonth = getFirstDayOfMonth(year, month);
    const lastDayOfTheMonth = getLastDayOfMonth(year, month);
    const tmpMonthDates = populateDateRange(firstDayOfTheMonth, lastDayOfTheMonth);
    setMonthDates(tmpMonthDates);

    const promises = [];
    console.log('locations', locations)
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
    <Container fluid>
      <Row>
        <Col xs={2}>
          <Form>
            <Form.Group className="mb-3" >
              <Form.Label>Mes</Form.Label>
              <Form.Select value={month} onChange={({ target }) => setMonth(target.value)}>
                {months.map(o => <option value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Año</Form.Label>
              <Form.Select value={year} onChange={({ target }) => setYear(target.value)}>
                {years.map(o => <option value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Contaminante</Form.Label>
              <Form.Select value={contaminant} onChange={({ target }) => setContaminant(target.value)}>
                {gasesOptions.map(o => <option value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Promedio/Índice</Form.Label>
              <Form.Select value={avgType} onChange={({ target }) => setAvgType(target.value)}>
                {avgOptions?.map(o => <option value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Form.Group>
            <Button onClick={handleClick} disabled={isLoading}>
              Obtener datos
            </Button>
          </Form>
        </Col>
        <Col xs={10}>
          {
            isLoading &&
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
          {
            monthData &&
            <div className="mt-3">
              <h6>Tabla para contaminante {contaminant} con la norma {avgType} {month} {year}</h6>
              <div className="annual-report-table mb-3">
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
              </div></div>
          }
        </Col>

      </Row>
    </Container >
  );
}
