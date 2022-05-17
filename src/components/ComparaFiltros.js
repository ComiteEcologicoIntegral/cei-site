import React, {useRef, useMemo, useState, useEffect} from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import Select from 'react-select';
import moment from 'moment'
import { systemOptions, indicadores, idBlacklistpriv } from '../constants';

// Componente para la página de Compara Datos
const ComparaFiltros = (props) => {
    const id = useRef(props.id); // ID para el componente, pues se pueden agregar varios
    let sensores = props.sensores; // Opciones del dropdown de sensores
    
    // Datos de cada input:
    const [system, setSystem] = useState("PurpleAir");
    const [indOptions, setIndOptions] = useState(indicadores)
    const [location, setLocation] = useState(null)
    const [indicador, setIndicador] = useState(indicadores[0])
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

    useEffect(() => {
        updateData();
    }, [indicador])

    // Cada que cambie uno de los inputs, se mandan al componente padre porque allá se crea el query
    function updateData() {
        //Solo el primer filtro tiene hasta y hastaHora
        let tempHasta = null
        let tempHastaHora = null
        let tempDesdeHora = null
        if (id.current == 0){
            tempHasta=hasta.current
            tempHastaHora = hastaHora.current
            tempDesdeHora = desdeHora.current
        }
        let formData = {
            ubic: ubic.current,
            ind: indicador.value,
            desde: desde.current,
            hasta: tempHasta,
            desdeHora: tempDesdeHora,
            hastaHora: tempHastaHora,
        }
        props.modifyData(formData, id.current);
    }

    // Funcion para revisar si el contaminante seleccionado es valido en el sistema
    const checkIfSystemValid = (value) => {
        // Checar si selecciono Purple Air
        if(value.label === 'PurpleAir'){
            // Checar si esta seleccionado otro contaminante que no sea PM25
            if(indicador.value !== 'PM25'){
                setIndicador(indicadores[0])
                // console.log(indicadores)
                // indicador.current = indicadores[0];
            }
        }
    }

    const today = moment().format("YYYY-MM-DD")
            
    //Solo el primero deja ingresar hasta, otros filtros tienen mensaje/estan vacios en ese espacio
    if (id.current==0){
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
                                            checkIfSystemValid(value)
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
                                        value={indicador}
                                        onChange={setIndicador}
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
                                            min = "2018-01-01"
                                            max = {today}
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
                                            min = "2018-01-01"
                                            max = {today}
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
    }else{// if (id.current==2){
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
                                            checkIfSystemValid(value)
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
                                        value={indicador}
                                        onChange={setIndicador}
                                    />
                                        <b style={{ position:'absolute', bottom:'0'}}>Nota</b>
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
                                            id={"filtro-" + id.current+"desde"}
                                            className="cf-input" 
                                            type="date" 
                                            min = "2018-01-01"
                                            max = {today}
                                            onChange={(event) => {
                                                desde.current = event.target.value;
                                                updateData()}}>
                                            </Form.Control>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={6}>
                                        <div style={{'background-color': 'white', margin:'25px 15px 25pcx 0px', 'border-radius': '10px'}}>
                                            <div style={{'margin-left': '10px'}}><a>El lapso de tiempo debe ser el mismo al del primer filtro por lo cual se calcula a partir de la fecha de inicio</a></div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Col>
        )
    }
}

export default ComparaFiltros
