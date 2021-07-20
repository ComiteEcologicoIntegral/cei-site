import React, {useRef, useImperativeHandle, useMemo, useState} from 'react'
import { Form, Button, Col, Row } from 'react-bootstrap'
import Select from 'react-select';
import { systemOptions } from '../constants';

// Opciones del dropdown de gases:
const indicadores = [
    {value: 'PM25', label: 'PM2.5'},
    {value: 'PM10', label: 'PM10'},
    {value: 'O3', label: 'O3'},
    {value: 'CO', label: 'CO'},
    {value: 'NO2', label: 'NO2'},
    {value: 'SO2', label: 'SO2'}
]

// Componente para la página de Compara Datos
const ComparaFiltros = (props) => {
    const id = useRef(props.id); // ID para el componente, pues se pueden agregar varios
    let sensores = props.sensores; // Opciones del dropdown de sensores
    
    // Datos de cada input:
    const [system, setSystem] = useState("PurpleAir");
    const ubic = useRef(sensores[0].zona ? sensores[0].zona : null);
    const ind = useRef(indicadores[0].value);
    const desde = useRef(null);
    const hasta = useRef(null);

    const sensorOptions = useMemo(() => {
        return sensores
            .filter(
                (sensor) =>
                    sensor.sistema === system
            )
            .map((record) => ({
                value: record.sensor_id,
                label: record.zona,
            }));
    }, [sensores, system]);

    // Cada que cambie uno de los inputs, se mandan al componente padre porque allá se crea el query
    function updateData() {
        let formData = {
            ubic: ubic.current,
            ind: ind.current,
            desde: desde.current,
            hasta: hasta.current
        }
        console.log(ubic.current)
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
                                    options={systemOptions} 
                                    defaultValue={systemOptions[0]}
                                    className="mb-2"
                                    onChange={(value) => {
                                        setSystem(value.value)}}
                                    />
                                    <Select 
                                    options={sensorOptions} 
                                    defaultValue={sensorOptions[0]}
                                    className="mb-2"
                                    onChange={(value) => {
                                        console.log(value)
                                        ubic.current = value;
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
