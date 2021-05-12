import React, {useRef, useImperativeHandle} from 'react'
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

const ComparaFiltros = (props) => {
    const id = useRef(props.id);
    let sensores = props.sensores;
    
    const ubic = useRef(sensores[0].value);
    const ind = useRef(indicadores[0].value);
    const desde = useRef(null);
    const hasta = useRef(null);

    function updateData() {
        let formData = {
            ubic: ubic.current,
            ind: ind.current,
            desde: desde.current,
            hasta: hasta.current
        }
        props.modifyData(formData, id.current);
    }

    return (
        <Col sm={6}>
            <div className="compara-filtros mt-2 mb-4" id={"filtro-" + id.current}>
                <Form>
                    <Form.Group as={Row}>
                        <Col sm={12}>
                            <Row>
                                <Col sm={6}>
                                    <Select 
                                    options={sensores} 
                                    defaultValue={sensores[0]}
                                    className="mb-2"
                                    onChange={(value) => {
                                        ubic.current = value.value;
                                        updateData()}}
                                    />
                                </Col>
                                <Col sm={6}>
                                    <Select 
                                    options={indicadores} 
                                    defaultValue={indicadores[0]}
                                    onChange={(value) => {
                                    ind.current = value.value;
                                    updateData()}}
                                />
                                </Col>
                            </Row>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={12}>
                            <Row>
                                <Col sm={6}>
                                    <Row>
                                        <Col sm={3}>
                                            <p>Desde:</p>
                                        </Col>
                                        <Col sm={9}>
                                        <Form.Control 
                                        className="cf-input" 
                                        type="date" 
                                        onChange={(event) => {
                                            desde.current = event.target.value;
                                            updateData()}}>
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={6}>
                                    <Row>
                                        <Col sm={3}>
                                            <p>Hasta:</p>
                                        </Col>
                                        <Col sm={9}>
                                        <Form.Control 
                                        className="cf-input" 
                                        type="date" 
                                        onChange={(event) => {
                                            hasta.current = event.target.value;
                                            updateData()}}>
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </Col>
    )
}

export default ComparaFiltros
