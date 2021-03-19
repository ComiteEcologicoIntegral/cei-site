import React from 'react'
import RHFiltros from './components/RHFiltros'
import { Button, Col, Row } from 'react-bootstrap'
import HeatMap from './components/HeatMap'


function Calendario() {
    return (
        <div className="container mb-10">
            <RHFiltros />
            <Row className="mb-5">
            <Col sm={12} lg={4} xl={3}>
            <div>
                <Button className="btn btn-light mb-3 mt-3" block>Descargar datos</Button>
                <div className="detalles">
                    Detalles
                </div>
            </div>
            </Col>
            <Col sm={12} lg={8} xl={9}>
                <HeatMap />
            </Col>
            </Row>
        </div>
    )
}

export default Calendario
