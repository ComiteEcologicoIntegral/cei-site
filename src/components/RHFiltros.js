import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { Form, ButtonGroup, Button, Col, ToggleButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchSummaryData } from '../handlers/data';
import { setSensorData } from '../redux/reducers';
import { indicadores, idBlacklistpriv } from '../constants'

// Diferente a la que esta definida en constants porque este debe de decir AireNL/Sinaica junto
const systemOptions = [
    { value: "PurpleAir", label: 'PurpleAir', opt: 'P' },
    { value: "AireNuevoLeon", label: 'AireNuevoLeon/Sinaica', opt: 'G' }
]

// Componente para la página de Registro Histórico
function RHFiltros({
    createQueryGraph,
    createQueryCal,
    radioValue,
    setRadioValue,
    updateMainFiltros,
}) {
    /*
        Parámetros:
            - createQueryGraph: función para crear query de la gráfica
            - createQueryCal: función para crear query del calendario
            - radioValue: sección seleccionada
            - setRadioValue: función para cambiar el radioValue
            - updateMainFiltros: función para updatear en el componente padre los inputs seleccionados
    */


    const radios = [
        { name: 'Grafica', value: '1' },
        { name: 'Calendario', value: '2' },
    ];

    const dispatch = useDispatch();
    const { sensorDataLastUpdate, sensorData } = useSelector((state) => state);

    const [sensRaw, setSensRaw] = useState(null);
    let sensores = [];

    useEffect(() => {
        // TODO: convertir a hook
        const diff = sensorDataLastUpdate
            ? moment().diff(sensorDataLastUpdate, 'minutes')
            : 999;

        if (diff > 60) {
            fetchSummaryData()
                .then((data) => {
                    dispatch(setSensorData(data));
                    setSensRaw(data);
                })
                .catch((err) => console.error(err));
        } else {
            setSensRaw(sensorData);
        }
    }, []);

    const [system, setSystem] = useState("")
    const [indOptions, setIndOptions] = useState(indicadores);
    const [location, setLocation] = useState(null)

    const [indicador, setIndicador] = useState(indicadores[0])

    const sistema = useRef(null);
    const ubicacion = useRef(null);
    // const indicador = useRef(indicadores[0]);

    useEffect(() => {
        system.value === "PurpleAir" ? setIndOptions([indicadores[0]]) : setIndOptions(indicadores)
    }, [system]); // Updatea los gases disponibles cuando cambia la variable sistemas

    // Crear valores para el dropdown:
    if (sensRaw) {
        sensRaw.forEach((element) => {
            if (system.value === element.Sistema &&
                !idBlacklistpriv.includes(element.Sensor_id)) {
                sensores.push({ value: element.Sensor_id, label: element.Zona });
            }
        });
    }

    // Función general para crear el query
    function createQuery() {
        updateMainFiltros(ubicacion.current, indicador, sistema.current); // Actualiza los valores de los filtros en el componente padre
        if (radioValue === '1') {
            createQueryGraph();
        } else {
            createQueryCal();
        }
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
        
    return (
        <div className="mt-5">
            <div className="ta-center mb-5">
                <h2>Registro Histórico</h2>
                <p>Consulta los datos históricos de la calidad del aire</p>
            </div>
            <ButtonGroup toggle style={{width: "100%"}}>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        className="toggle-vista"
                        key={idx}
                        type="radio"
                        variant="light"
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) =>
                            setRadioValue(e.currentTarget.value)
                        }
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
            <div>
                {radioValue == "1" && (
                    <div className='mt-3'>
                        <p>En este apartado puedes generar y filtrar gráficas a partir de los registros de la calidad del aire de la cantidad con la cantidad de días que desees.</p>
                        <ol>
                            <li>Selecciona los filtros que deseas aplicar.</li>
                            <li>Selecciona la fecha inicial y fecha final de la gráfica.</li>
                        </ol>
                    </div>
                )}
                {radioValue == "2" && (
                    <div className='mt-3'>
                        <p>En este apartado puedes consultar y descargar los registros de la calidad del aire mensualmente.</p>
                        <ol>
                            <li>Selecciona los filtros que deseas aplicar.</li>
                            <li>Selecciona el mes que desea conultar.</li>
                        </ol>
                    </div>
                )}
            </div>
            <Form className='mb-3'>
                <Form.Row className="mb-3">
                    <Col xs={6}>
                        <p className='font-weight-bold mb-1'>Sistema</p>
                            <p style={{fontSize: "0.8rem"}} className="mb-1">Selecciona el sistema de sensores que deseas visualizar.</p>
                            <p style={{fontSize: "0.8rem"}} className="mb-1">*Recuerda que el sistema PurpleAir solo tiene disponible el contaminante PM2.5</p>
                        <Select
                            options={systemOptions}
                            placeholder={'Sistema'}
                            onChange={(value) => {
                                checkIfSystemValid(value)
                                setLocation(null)
                                ubicacion.current = null
                                sistema.current = value
                                setSystem(value)
                            }}
                        />
                    </Col>
                    <Col xs={6}>
                    <p className='font-weight-bold mb-2'>Ubicación</p>
                        <p style={{fontSize: "0.8rem"}} className="mb-1">Selecciona la ubicación que deseas resaltar (estas pueden variar dependiendo del sistema de sensores que selecciones).</p>
                        <Select
                            options={sensores}
                            value={location}
                            placeholder={'Ubicación'}
                            onChange={(value) => {
                                setLocation(value)
                                ubicacion.current = value;
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                    <p className='filtro-material font-weight-bold mb-1'>Contaminante</p>
                        <p style={{fontSize: "0.8rem"}} className="mb-1">Selecciona el contaminante que deseas filtrar.</p>
                        <Select
                            options={indOptions}
                            placeholder={'Indicador'}
                            onChange={setIndicador}
                            value={indicador}
                        />
                    </Col>
                    <Col className="col-boton">
                    <Button
                            className="btn-aplicar"
                            variant="primary"
                            block
                            onClick={() => createQuery()}
                        >
                            Aplicar
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <hr className="mt-2 mb-4" />
        </div>
    );
}

export default RHFiltros;
