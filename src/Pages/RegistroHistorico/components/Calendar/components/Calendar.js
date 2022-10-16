import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Accordion, Card } from 'react-bootstrap'
import DatePicker from './DatePicker'
import { AiFillCaretDown, AiFillRightSquare } from "react-icons/ai";
import { getStatus } from '../../../../../handlers/statusCriteria';
import Select from 'react-select';
import moment from 'moment'
import './Calendar.css';
import 'moment/locale/es';

const unidad = {
    PM25: "µg/m3",
    PM10: "µg/m3",
    CO: "ppm",
    O3: "ppm",
    NO2: "ppm",
    SO2: "ppm"
}

// Valores para los dropdowns:
const meses = [
    { value: '1', label: 'enero' },
    { value: '2', label: 'febrero' },
    { value: '3', label: 'marzo' },
    { value: '4', label: 'abril' },
    { value: '5', label: 'mayo' },
    { value: '6', label: 'junio' },
    { value: '7', label: 'julio' },
    { value: '8', label: 'agosto' },
    { value: '9', label: 'septiembre' },
    { value: '10', label: 'octubre' },
    { value: '11', label: 'noviembre' },
    { value: '12', label: 'diciembre' }
]

const anios = [
    { value: '2018', label: '2018' },
    { value: '2019', label: '2019' },
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },

]

// Componente para la página de Registro Histórico
function Calendario({ q, fecha, ubic, create, data, gas, setDesde, setHasta, downloadFile }) {
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

    const [value, setValue] = useState(moment()); // Valor del día que está seleccionado en el calendario, se inicializa con el dia actual

    // Para resetear los valores si es que fueron utilizados en la sección de la gráfica:
    useEffect(() => {
        setDesde(value);
        setHasta(value);
    }, []);

    // Valores de los dropdowns para navegar más rápido a otra fecha, inicializados con la fecha actual
    const [inMes, setInMes] = useState(new Date().getMonth() + 1);
    const [inAnio, setInAnio] = useState(anios[anios.length - 1].value);

    useEffect(() => {
        setDesde(value);
        setHasta(value);
        if (data || q) { // Solo se crea y ejecuta el query si ya se ha dado click en el botón Aplicar
            create(value, value);
        }
    }, [value]); // Cada que cambia el dia seleccionado, se actualizan los datos para crear el query

    useEffect(() => {
        let f = new Date(`${inMes}/${value.clone().format('DD')}/${inAnio}`); // Nos colocamos en el primer dia del mes para evitar que al moverte al siguiente mes, se coloque en un día futuro o inexistente
        setValue(moment(f));
    }, [inMes, inAnio]); // Cada que cambia un valor de los dropdowns, cambiamos el valor del día seleccionado

    // Cuando ya se hizo el fetch para traer datos:
    let dataCol1 = [];
    let dataCol2 = [];
    let index = 0;
    let currHour = 0;

    if (data && data.length !== 0) {
        // Primera columna (horas de 00:00 a 11:00)
        while (currHour < 12 && index < data.length) {
            let ch = "T" + currHour.toString().padStart(2, 0) + ":";
            let info = [];

            let firstIndex = index;

            // Junta los datos de la misma hora aunque sean de diferente sensor para ponerlos en un mismo acordión
            while (index < data.length && data[index]["dia"].includes(ch)) {
                // Se crea un p tag con un bullet de color, ubicación, medida registrada y unidad
                info.push(<p><AiFillRightSquare className={colorIndice(data[index][gas])} />{data[index]["zona"]}: {data[index][gas] ? ` ${data[index][gas]} ${unidad[gas]}` : " No hay registro"}</p>);
                index++;
            }

            dataCol1.push(
                <Accordion key={data[firstIndex].registros_id} id={data[firstIndex].registros_id}>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} className="hora"
                                variant="link"
                                eventKey={data[firstIndex].registros_id}>
                                <AiFillCaretDown color="lightgray" /> {currHour.toString().padStart(2, 0)}:00
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={data[firstIndex].registros_id}>
                            <Card.Body>
                                {info}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            )

            currHour++;
        }

        // Segunda columna (horas de 12:00 a 23:00)
        while (currHour < 24 && index < data.length) {
            let ch = "T" + currHour.toString().padStart(2, 0);
            let info = [];

            let firstIndex = index; // Esta variable sirve para darle un key a cada acordión, sin pasarnos del último índice

            while (index < data.length && data[index]["dia"].includes(ch)) {
                info.push(<p><AiFillRightSquare className={colorIndice(data[index][gas])} /> {data[index]["zona"]}: {data[index][gas] ? `${data[index][gas]} ${unidad[gas]}` : "No hay registro"}</p>);
                index++;
            }

            dataCol2.push(
                <Accordion key={data[firstIndex].registros_id} id={data[firstIndex].registros_id}>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} className="hora"
                                variant="link"
                                eventKey={data[firstIndex].registros_id}>
                                <AiFillCaretDown color="lightgray" /> {currHour.toString().padStart(2, 0)}:00
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={data[firstIndex].registros_id}>
                            <Card.Body>
                                {info}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            )

            currHour++;
        }
    } else {
        dataCol1.push(<p>No hay datos para este día</p>);
    }


    return (
        <div className="container mb-10">

            <Row className="mb-5">
                <Col sm={12} lg={6}>
                    <div>
                        <Button className="btn btn-light mb-4 mt-4" block onClick={downloadFile}>Descargar datos del mes</Button>
                        <Row className="mb-4">
                            <Col sm={6}>
                                <Select
                                    options={meses}
                                    placeholder={'Mes'}
                                    onChange={(target) => setInMes(target.value)}
                                    defaultValue={meses[new Date().getMonth()]}
                                />
                            </Col>
                            <Col sm={6}>
                                <Select
                                    options={anios}
                                    placeholder={'Año'}
                                    onChange={(target) => setInAnio(target.value)}
                                    defaultValue={anios[anios.length - 1]}
                                />
                            </Col>
                        </Row>
                        <div className="detalles">
                            <h4>{value && value.format("DD/MM/YYYY")} Detalle por hora</h4>
                            <Row>
                                <Col sm={6}>
                                    {dataCol1}
                                </Col>
                                <Col sm={6}>
                                    {dataCol2}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
                <Col sm={12} lg={6} className="d-flex align-items-start justify-content-center">
                    <DatePicker q={q} fecha={fecha} ubic={ubic} ind={gas} value={value} onChange={setValue} />
                </Col>
            </Row>
        </div>
    )
}

export default Calendario
