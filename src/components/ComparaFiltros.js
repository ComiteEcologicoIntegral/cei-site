import React, {useRef, useMemo, useState, useEffect} from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import Select from 'react-select';
import { systemOptions, indicadores, idBlacklistpriv } from '../constants';

// Componente para la página de Compara Datos
const ComparaFiltros = (props) => {
    const id = useRef(props.id); // ID para el componente, pues se pueden agregar varios
    let sensores = props.sensores; // Opciones del dropdown de sensores
    
    // Datos de cada input:
    const [system, setSystem] = useState("PurpleAir");
    const [indOptions, setIndOptions] = useState(indicadores)
    const [location, setLocation] = useState(null)
    const ubic = useRef(sensores[0].zona ? sensores[0].zona : null);
    const ind = useRef(indicadores[0].value);
    const desde = useRef(null);
    const hasta = useRef(null);
    const desdeHora = useRef('00:00:00');
    const hastaHora = useRef('00:00:00');

    useEffect(() => {
        system === "PurpleAir" ? setIndOptions([indicadores[0]]) : setIndOptions(indicadores)
    }, [system]);

    const sensorOptions = useMemo(() => {
        return sensores
            .filter(
                (sensor) =>
                    sensor.sistema === system &&
                    !idBlacklistpriv.includes(sensor.Sistema)
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
            hasta: hasta.current,
            desdeHora: desdeHora.current,
            hastaHora: hastaHora.current
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
                                    options={systemOptions} 
                                    placeholder={'Sistema'}
                                    className="mb-2"
                                    onChange={(value) => {
                                        setSystem(value.value)
                                        setLocation(null)
                                        ubic.current = null
                                        updateData()
                                    }}
                                    />
                                    <Select 
                                    options={sensorOptions} 
                                    value={location}
                                    placeholder={'Ubicación'}
                                    className="mb-2"
                                    onChange={(value) => {
                                        setLocation(value)
                                        ubic.current = value;
                                        updateData()}}
                                    />
                                </Col>
                                <Col sm={6}>
                                    <Select 
                                    options={indOptions} 
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
                                    <Row>
                                        <Col sm={3}></Col>
                                        <Col sm={9}>
                                            <Form.Control 
                                            onChange={(event) => {
                                                desdeHora.current = event.target.value + ':00';
                                                updateData()
                                            }}
                                            type="time">
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
                                    <Row>
                                        <Col sm={3}></Col>
                                        <Col sm={9}>
                                            <Form.Control
                                            onChange={(event) => {
                                                hastaHora.current = event.target.value + ':00';
                                                updateData()
                                            }}                                            
                                            type="time"></Form.Control>
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
