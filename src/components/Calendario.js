import React, { useState, useEffect } from 'react'
import '../styles/calendario.css';
import { Button, Col, Row, Accordion, Card } from 'react-bootstrap'
import HeatMap from './HeatMap'
import { AiFillCaretDown } from "react-icons/ai";
import moment from 'moment'
import 'moment/locale/es';

moment.locale('es');


function Calendario({create, data, indi, setDesde, setHasta}) {
    const [value, setValue] = useState(moment()); // currently selected date
    let dataCol1 = [];
    let dataCol2 = [];
    let index = 0;
    let currHour = 0;

    useEffect(() => {
        let today = moment();
        setDesde(today.format("YYYY-MM-DD"));
        setHasta(today.format("YYYY-MM-DD"));
    }, []);

    useEffect(() => {
        setDesde(value.format("YYYY-MM-DD"));
        setHasta(value.format("YYYY-MM-DD"));
        if (data) {
            dataCol1 = [];
            dataCol2 = [];
            create();
        }
    }, [value]);

    if (data && data.length != 0) {
        while (currHour < 12 && index < data.length) {
            let ch = "T" + currHour.toString().padStart(2, 0);
            let info = [];

            // junta todos los de la misma hora
            while ( index < data.length && data[index]["dia"].includes(ch) ) {
                info.push(<p>{data[index]["zona"]}: {data[index][indi] ? data[index][indi] : "No hay registro"}</p>);
                index++;
            }

            currHour++;
            if (index == data.length) {
                index--;
            }

            dataCol1.push(
            <Accordion key={data[index].registros_id} id={data[index].registros_id}>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} className="hora"
                            variant="link"
                            eventKey={data[index].registros_id}>
                            <AiFillCaretDown color="lightgray"/> {currHour.toString().padStart(2, 0)}:00
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={data[index].registros_id}>
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

            // junta todos los de la misma hora
            while ( index < data.length && data[index]["dia"].includes(ch) ) {
                info.push(<p>{data[index]["zona"]}: {data[index][indi] ? data[index][indi] : "No hay registro"}</p>);
                index++;
            }

            currHour++;
            if (index == data.length) {
                index--;
            }

            dataCol2.push(
            <Accordion key={data[index].registros_id} id={data[index].registros_id}>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} className="hora"
                            variant="link"
                            eventKey={data[index].registros_id}>
                            <AiFillCaretDown color="lightgray"/> {currHour.toString().padStart(2, 0)}:00
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={data[index].registros_id}>
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
                <Button className="btn btn-light mb-3 mt-3" block>Descargar datos</Button>
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
                <HeatMap value={value} onChange={setValue}/>
            </Col>
            </Row>
        </div>
    )
}

export default Calendario
