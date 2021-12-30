import moment from 'moment';
import React, { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Plot from 'react-plotly.js';

function Grafica({ setDesde, setHasta, setDesdeHora, setHastaHora, data, layout, summary }) {
    useEffect(() => {
        setDesde(null);
        setHasta(null);
        setDesdeHora('00:00:00')
        setHastaHora('00:00:00')
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
                                    onChange={(event) => setDesde(moment(event.target.value))}
                                ></Form.Control>
                            </Col>

                            <Col xs={5}>
                                <Form.Control
                                    onChange={(event) => setDesdeHora(event.target.value + ':00')}
                                    type="time"></Form.Control>
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
                                <Form.Control
                                    onChange={(event) => setHastaHora(event.target.value + ':00')}
                                    type="time"></Form.Control>
                            </Col>
                        </Row>
                    </Col>
                </Form.Row>
            </Form>

            <Row className="mb-5">
                <Col xs={12} lg={4} xl={2}>
                    <Row xs={12}>
                        <Button className="btn btn-light mb-4" block>
                            Descargar datos
                        </Button>
                    </Row>
                    <Row className="d-flex justify-content-center">
                        <Col xs={6} sm={5} lg={12}>
                            <Row className="dato-calculado d-flex justify-content-center">
                                <Row sm={12}>
                                    <p className="tipo text-center">Máximo</p>
                                    <p className="desc text-center">{summary && summary?.max.date ? `Registrado el ${summary?.max.date}` : ''}</p>
                                </Row>
                                <Row
                                    sm={12}
                                    className="d-flex align-items-center justify-content-end"
                                >
                                    <p className="numero muymala text-center">
                                        {summary && typeof summary?.max.value === 'number'
                                            ? summary.max.value.toFixed(2)
                                            : '-'}
                                    </p>
                                </Row>
                            </Row>
                        </Col>
                        <Col xs={6} sm={5} lg={12}>
                            <Row className="dato-calculado d-flex justify-content-center">
                                <Row sm={12}>
                                    <p className="tipo text-center">Mínimo</p>
                                    <p className="desc text-center">{summary && summary?.min.date ? `Registrado el ${summary?.min.date}` : ''}</p>
                                </Row>
                                <Row
                                    sm={12}
                                    className="d-flex align-items-center justify-content-end"
                                >
                                    <p className="numero acept text-center">
                                        {summary && typeof summary?.min.value === 'number'
                                            ? summary.min.value.toFixed(2)
                                            : '-'}
                                    </p>
                                </Row>
                            </Row>
                        </Col>
                        <Col xs={6} sm={5} lg={12}>
                            <Row className="dato-calculado d-flex align-items-center justify-content-center">
                                <Row sm={12}>
                                    <p className="tipo text-center">Promedio</p>
                                    {/* <p className="desc">{summary && summary?.avg.da`Registrado el 00-00-000`}</p> */}
                                </Row>
                                <Row
                                    sm={12}
                                    className="d-flex align-items-center justify-content-end"
                                >
                                    <p className="numero mala text-center">
                                        {summary && typeof summary?.avg.value === 'number'
                                            ? summary.avg.value.toFixed(2)
                                            : '-'}
                                    </p>
                                </Row>
                            </Row>
                        </Col>
                        <Col xs={6} sm={5} lg={12}>
                            <Row className="dato-calculado d-flex align-items-center justify-content-center">
                                <Row sm={12}
                                    className="d-flex align-items-center justify-content-center">
                                    <p className="tipo text-center">Arriba de la norma</p>
                                </Row>
                                <Row sm={12}
                                    className="d-flex align-items-center justify-content-center">
                                    {/* <p className="numero mala text-center">{summary ? summary.porcentajes.arribaLimite + '%' : '-'}</p> */}
                                    <p className={`numero text-center ${summary ? (summary.porcentajes.arribaLimite == 0 ? "bueno" : summary.porcentajes.arribaLimite > 25 ? "muymala" : "mala") : null}`}>{summary ? summary.porcentajes.arribaLimite + '%' : '-'}</p>
                                </Row>
                            </Row>
                        </Col>
                        <Col xs={12} sm={5} lg={12}>
                            <Row className="dato-calculado">
                                <Col xs={6} sm={6}
                                    className="d-flex flex-column align-items-center justify-content-center">
                                    <p className="tipo text-center">Datos Válidos</p>
                                    <p className="numero bueno text-center">{summary ? summary.porcentajes.buenos + '%' : '-'}</p>
                                </Col>
                                <Col xs={6} sm={6}
                                    className="d-flex flex-column align-items-center justify-content-center">
                                    <p className="tipo text-center">Datos Nulos</p>
                                    <p className="numero muymala text-center">{summary ? summary.porcentajes.nulos + '%' : '-'}</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col sm={12} lg={8} xl={10}>
                    <div className="grafico mb-4">
                        <Plot className="grafico-resize" data={data} layout={layout} config={{ responsive: true }} />
                    </div>
                </Col>
                <Row className="d-block d-sm-none w-100" xs={11}>
                    <p>*Para una mejor visualización, utiliza el telefono horizontalmente.</p>
                </Row>
            </Row>
        </div>
    );
}

export default Grafica;
