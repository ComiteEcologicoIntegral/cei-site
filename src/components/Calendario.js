import React, { useState, useEffect } from 'react'
import '../styles/calendario.css';
import { Button, Col, Row, Accordion, Card } from 'react-bootstrap'
import DatePicker from './DatePicker'
import { AiFillCaretDown, AiFillRightSquare } from "react-icons/ai";
import { getStatus } from '../handlers/statusCriteria';
import moment from 'moment'
import 'moment/locale/es';

moment.locale('es');

const unidad = {
    PM25: "µg/m3",
    PM10: "µg/m3",
    CO: "ppm",
    O3: "ppm",
    NO2:"ppm", 
    SO2: "ppm"
}

function Calendario({create, data, indi, setDesde, setHasta, downloadFile}) {
    function colorIndice(medida) {
        let val = getStatus(indi, medida);

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
                return "";
        }
    }
    
    const [value, setValue] = useState(moment()); // currently selected date
    let dataCol1 = [];
    let dataCol2 = [];
    let index = 0;
    let currHour = 0;

    useEffect(() => {
        let today = moment();
        setDesde(today);
        setHasta(today);
    }, []);

    useEffect(() => {
        setDesde(value);
        setHasta(value);
        if (data) {
            create();
        }
    }, [value]);

    if (data && data.length !== 0) {
        while (currHour < 12 && index < data.length) {
            let ch = "T" + currHour.toString().padStart(2, 0);
            let info = [];

            let firstIndex = index;
            // junta todos los de la misma hora
            while ( index < data.length && data[index]["dia"].includes(ch) ) {
                info.push(<p><AiFillRightSquare className={colorIndice(data[index][indi])}/>{data[index]["zona"]}: {data[index][indi] ? ` ${data[index][indi]} ${unidad[indi]}` : " No hay registro"}</p>);
                index++;
            }

            currHour++;

            dataCol1.push(
            <Accordion key={data[firstIndex].registros_id} id={data[firstIndex].registros_id}>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} className="hora"
                            variant="link"
                            eventKey={data[firstIndex].registros_id}>
                            <AiFillCaretDown color="lightgray"/> {currHour.toString().padStart(2, 0)}:00
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
        }
        
        while (currHour < 24 && index < data.length) {
            let ch = "T" + currHour.toString().padStart(2, 0);
            let info = [];

            let firstIndex = index;
            // junta todos los de la misma hora
            while ( index < data.length && data[index]["dia"].includes(ch) ) {
                info.push(<p><AiFillRightSquare className={colorIndice(data[index][indi])}/> {data[index]["zona"]}: {data[index][indi] ? `${data[index][indi]} ${unidad[indi]}` : "No hay registro"}</p>);
                index++;
            }

            currHour++;

            dataCol2.push(
            <Accordion key={data[firstIndex].registros_id} id={data[firstIndex].registros_id}>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} className="hora"
                            variant="link"
                            eventKey={data[firstIndex].registros_id}>
                            <AiFillCaretDown color="lightgray"/> {currHour.toString().padStart(2, 0)}:00
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
        }
    } else {
        dataCol1.push(<p>No hay datos para este día</p>);
    }

    return (
        <div className="container mb-10">
            
            <Row className="mb-5">
            <Col sm={12} lg={6}>
            <div>
                <Button className="btn btn-light mb-3 mt-3" block onClick={downloadFile}>Descargar datos del mes</Button>
                <div className="detalles">
                    <h4>{value.format("DD/MM/YYYY")} Detalle por hora</h4>
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
                <DatePicker value={value} onChange={setValue}/>
            </Col>
            </Row>
        </div>
    )
}

export default Calendario
