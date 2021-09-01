import moment from 'moment';
import React, { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Plot from 'react-plotly.js';

function Grafica({ setDesde, setHasta, data, layout, summary }) {
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
                                <Form.Label className="col-form-label">
                                    Desde:{' '}
                                </Form.Label>
                            </Col>

                            <Col xs={5}>
                                <Form.Control
                                    type="date"
                                    required
                                    onChange={(event) =>
                                        setDesde(moment(event.target.value))
                                    }
                                ></Form.Control>
                            </Col>

                            <Col xs={5}>
                                <Form.Control type="time"></Form.Control>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} lg={5} className="mb-3">
                        <Row>
                            <Col xs={2}>
                                <Form.Label className="col-form-label">
                                    Hasta:{' '}
                                </Form.Label>
                            </Col>

                            <Col xs={5}>
                                <Form.Control
                                    type="date"
                                    required
                                    onChange={(event) =>
                                        setHasta(moment(event.target.value))
                                    }
                                ></Form.Control>
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
                        <Button className="btn btn-light mb-4" block>
                            Descargar datos
                        </Button>
                    </Row>
                    <Row className="d-flex justify-content-around">
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={5}>
                                    <p className="tipo">Máximo</p>
                                    <p className="desc">{summary && summary?.max.date ? `Registrado el ${summary?.max.date}` : ''}</p>
                                </Col>
                                <Col
                                    sm={7}
                                    className="d-flex align-items-center justify-content-end"
                                >
                                    <p className="numero muymala">
                                        {summary && typeof summary?.max.value === 'number'
                                            ? summary.max.value.toFixed(2)
                                            : '-'}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={5}>
                                    <p className="tipo">Mínimo</p>
                                    <p className="desc">{summary && summary?.min.date ? `Registrado el ${summary?.min.date}` : ''}</p>
                                </Col>
                                <Col
                                    sm={7}
                                    className="d-flex align-items-center justify-content-end"
                                >
                                    <p className="numero acept">
                                        {summary && typeof summary?.min.value === 'number'
                                            ? summary.min.value.toFixed(2)
                                            : '-'}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={5}>
                                    <p className="tipo">Promedio</p>
                                    {/* <p className="desc">{summary && summary?.avg.da`Registrado el 00-00-000`}</p> */}
                                </Col>
                                <Col
                                    sm={7}
                                    className="d-flex align-items-center justify-content-end"
                                >
                                    <p className="numero mala">
                                        {summary && typeof summary?.avg.value === 'number'
                                            ? summary.avg.value.toFixed(2)
                                            : '-'}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={6}
                                className="d-flex flex-column align-items-center justify-content-center">
                                    <p className="tipo text-center">Datos Válidos</p>
                                    <p className="numero bueno text-center">{summary ? summary.porcentajes.buenos + '%' : '-'}</p>
                                </Col>
                                <Col sm={6}
                                className="d-flex flex-column align-items-center justify-content-center">
                                    <p className="tipo text-center">Datos Nulos</p>
                                    <p className="numero muymala text-center">{summary ? summary.porcentajes.nulos + '%' : '-'}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col sm={8}
                                className="d-flex align-items-center justify-content-center">
                                    <p className="tipo text-center">Datos Arriba de límite</p>
                                </Col>
                                <Col sm={4}
                                className="d-flex align-items-center justify-content-center">
                                    {/* <p className="numero mala text-center">{summary ? summary.porcentajes.arribaLimite + '%' : '-'}</p> */}
                                    <p className={`numero text-center ${summary ? (summary.porcentajes.arribaLimite == 0 ? "bueno" : summary.porcentajes.arribaLimite > 25 ? "muymala" : "mala") : null}`}>{summary ? summary.porcentajes.arribaLimite + '%' : '-'}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col sm={12} lg={8} xl={9}>
                    <div className="grafico mb-4">
                        <Plot data={data} layout={layout} />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Grafica;
