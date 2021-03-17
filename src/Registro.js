import React from 'react'
import RHFiltros from './components/RHFiltros'
import { Form, Row, Col } from 'react-bootstrap';

function registro() {
    return (
        <div className="container">
            <RHFiltros />
            <Form className="mt-4">
                <Form.Row className="d-flex justify-content-evenly">
                    <Col xs={12} lg={5}>
                        <Row>
                            <Col xs={2}>
                            <Form.Label className="col-form-label" for="desde-fecha">Desde: </Form.Label>
                            </Col>

                            <Col xs={5}>
                            <Form.Control type="date"></Form.Control>
                            </Col>
                        
                            <Col xs={5}>
                            <Form.Control type="time"></Form.Control>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} lg={5}>
                        <Row>
                            <Col xs={2}>
                            <Form.Label  className="col-form-label" for="hasta-fecha">Hasta: </Form.Label>
                            </Col>

                            <Col xs={5}>
                            <Form.Control type="date"></Form.Control>
                            </Col>
                        
                            <Col xs={5}>
                            <Form.Control type="time"></Form.Control>
                            </Col>
                        </Row>
                    </Col>
                </Form.Row>
            </Form>
        </div>
    )
}

export default registro
