import React, {useEffect} from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap';

function Grafica({setDesde, setHasta}) {
    useEffect(() => {
        setDesde(null);
        setHasta(null);
    }, []);

    return (
        <div>
            <Form className="mt-4 mb-4">
                <Form.Row className="d-flex justify-content-evenly">
                    <Col xs={12} lg={5} className="mb-3">
                        <Row>
                            <Col xs={2}>
                            <Form.Label className="col-form-label">Desde: </Form.Label>
                            </Col>

                            <Col xs={5}>
                            <Form.Control type="date" required onChange={(event) => setDesde(event.target.value)}></Form.Control>
                            </Col>
                        
                            <Col xs={5}>
                            <Form.Control type="time"></Form.Control>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} lg={5} className="mb-3">
                        <Row>
                            <Col xs={2}>
                            <Form.Label  className="col-form-label">Hasta: </Form.Label>
                            </Col>

                            <Col xs={5}>
                            <Form.Control type="date" required onChange={(event) => setHasta(event.target.value)}></Form.Control>
                            </Col>
                        
                            <Col xs={5}>
                            <Form.Control type="time"></Form.Control>
                            </Col>
                        </Row>
                    </Col>
                </Form.Row>
            </Form>

            <Row className="mb-5">
                
                <Col sm={12} lg={4} xl={3}>
                    <Row>
                        <Button className="btn btn-light mb-4" block>Descargar datos</Button>
                    </Row>
                    <Row className="d-flex justify-content-around">
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={8}>
                                    <p className="tipo">Máximo</p>
                                    <p className="desc">Registrado el 00-00-000</p>
                                </Col>
                                <Col sm={4} className="d-flex align-items-center">
                                    <p className="numero muymala">XX</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={8}>
                                    <p className="tipo">Mínimo</p>
                                    <p className="desc">Registrado el 00-00-000</p>
                                </Col>
                                <Col sm={4} className="d-flex align-items-center">
                                <p className="numero acept">XX</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={8}>
                                    <p className="tipo">Promedio</p>
                                    <p className="desc">Registrado el 00-00-000</p>
                                </Col>
                                <Col sm={4} className="d-flex align-items-center">
                                    <p className="numero mala">XX</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col sm={12} lg={8} xl={9}>
                    <div className="grafico mb-4">

                    </div>
                </Col>
                
            </Row>
        </div>
    )
}

export default Grafica
