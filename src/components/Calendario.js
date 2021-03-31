import React, { useState } from 'react'
import '../styles/calendario.css';
import { Button, Col, Row, Accordion, Card } from 'react-bootstrap'
import HeatMap from './HeatMap'
import { AiFillCaretDown } from "react-icons/ai";
import moment from 'moment'
import 'moment/locale/es';

moment.locale('es');


function Calendario({data, indi}) {
    const [value, setValue] = useState(moment()); // currently selected date
    
    let dataCol1 = [];
    let dataCol2 = [];

    if (data) {
        for (let index = 0; index < 12; index++) {
            dataCol1.push(
            <Accordion key={data[index].Registros_id} id={data[index].Registros_id}>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} className="hora"
                            variant="link"
                            eventKey={data[index].Registros_id}>
                            <AiFillCaretDown color="lightgray"/> {index}:00
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={data[index].Registros_id}>
                        <Card.Body>
                            {indi}: {data[index][indi] ? data[index][indi] : "No hay registro"}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            )    
        }
        
        for (let index = 12; index < 24; index++) {
            dataCol2.push(
                <Accordion key={data[index].Registros_id} id={data[index].Registros_id}>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} className="hora"
                                variant="link"
                                eventKey={data[index].Registros_id}>
                                <AiFillCaretDown color="lightgray"/> {index}:00
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={data[index].Registros_id}>
                            <Card.Body>
                                {indi}: {data[index][indi] ? data[index][indi] : "No hay registro"}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            )       
        }
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
            <Col sm={12} lg={6} className="d-flex align-items-center justify-content-center">
                <HeatMap value={value} onChange={setValue}/>
            </Col>
            </Row>
        </div>
    )
}

export default Calendario
