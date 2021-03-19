import React from 'react'
import ComparaFiltros from './components/ComparaFiltros'
import { Col, Row } from 'react-bootstrap'


function Compara() {
    return (
        <div className="container mt-5">
            <div className="ta-center mb-5">
                <h2>Compara datos</h2>
                <p>Compara la calidad del aire en diferente lugar y tiempo</p>
            </div>
            <hr className="mb-5"/>
            <Row className="mb-5">
            <ComparaFiltros />
            <Col sm={12} lg={8} xl={9}>
                <div class="grafico">

                </div>
            </Col>
            </Row>
            <hr className="mb-5"/>
            <Row className="mb-5">
            <ComparaFiltros />
            <Col sm={12} lg={8} xl={9}>
                <div class="grafico">

                </div>
            </Col>
            </Row>
        </div>
    )
}

export default Compara
