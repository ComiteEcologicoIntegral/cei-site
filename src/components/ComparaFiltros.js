import React from 'react'
import { Form, Button, Col, Row } from 'react-bootstrap'
import Select from 'react-select';

const indicadores = [
    {value: 'PM25', label: 'PM25'},
    {value: 'PM10', label: 'PM10'},
    {value: 'O3', label: 'O3'},
    {value: 'CO', label: 'CO'},
    {value: 'NO2', label: 'NO2'},
    {value: 'SO2', label: 'SO2'}
]

const sensores = [
    {value : 'S1', label: 'Pastora'},
    {value : 'S2', label: 'San Nicolás'},
    {value : 'S3', label: 'Santa Catarina'},
    {value : 'S4', label: 'San Pedro'},
    {value : 'S5', label: 'Universidad'}
]

const ComparaFiltros = () => {
    return (
        <Col sm={12} lg={4} xl={3}>
            <div>
                <Button className="btn btn-light mb-3 mt-3" block>Descargar datos</Button>
            </div>
            <div className="compara-filtros mt-2 mb-4">
                <div className="ta-center mb-3">
                    <h4>Filtros</h4>
                </div>
                <Form>
                    <Form.Group as={Row}>
                    <Select 
                    options={sensores} 
                    defaultValue={sensores[0]}
                    className="mb-2"
                    />
                    <Select 
                    options={indicadores} 
                    defaultValue={indicadores[0]}
                    />
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={12} md={6} lg={12}>
                        <p>Desde:</p>
                        <Form.Control className="cf-input" type="date"></Form.Control>
                        <Form.Control className="cf-input" type="time"></Form.Control>
                        </Col>
                    
                        <Col sm={12} md={6} lg={12}>
                        <p>Hasta:</p>
                        <Form.Control className="cf-input" type="date"></Form.Control>
                        <Form.Control className="cf-input mb-0" type="time"></Form.Control>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </Col>
    )
}

export default ComparaFiltros
