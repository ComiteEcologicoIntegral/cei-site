import { useMemo, useState, useEffect } from 'react';
import {
    Form,
    Modal,
    Button,
    Col,
    Row,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { indicadores, idBlacklist, idBlacklistpriv } from '../constants'

const systemOptions = [
    {value: "PurpleAir", label: 'PurpleAir', opt: 'P'},
    {value: "AireNuevoLeon", label: 'AireNuevoLeon', opt: 'G'}
]

const intervalos =  [
    {value: 0, label: 'Indice Calidad Aire'},
    {value: 1, label: 'Concentracion horaria'},
    // {value: '2', label: '12 horas'},
    // {value: '3', label: '24 horas'},
    // {value: '4', label: 'Última semana'},
    // {value: '5', label: 'Último mes'},
    // {value: '6', label: 'Último año'}
]

const MapaFiltros = ({ onApply }) => {
    const { sensorData } = useSelector((state) => state);
    const [systemChosen, setSystemChosen] = useState("");
    const locationOptions = useMemo(() => {
        return sensorData
            .filter(
                (sensor) =>
                    typeof sensor.Longitud === 'number' &&
                    typeof sensor.Latitud === 'number' && 
                    sensor.Sistema === systemChosen.label &&
                    !idBlacklist.includes(sensor.Sensor_id) &&
                    !idBlacklistpriv.includes(sensor.Sensor_id)
            )
            .map((record) => ({
                value: record.Sensor_id,
                label: record.Zona,
            }));
    }, [sensorData, systemChosen]);

    const [indOptions, setIndOptions] = useState(indicadores);

    useEffect(() => {
        systemChosen.label === 'PurpleAir' ? setIndOptions([indicadores[0]]) : setIndOptions(indicadores)
    }, [systemChosen]); // Updatea los gases disponibles cuando cambia la variable sistemas

    const [show, setShow] = useState(false);
    const [location, setLocation] = useState(null);
    const [interval, setInterval_] = useState(intervalos[0]);
    const [gas, setGas] = useState(indicadores[0]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
   
    useEffect(() => {
        onApply({ gas, location, interval });
    }, [gas, location, interval])

    // Funcion para revisar si el contaminante seleccionado es valido en el sistema
    const checkIfSystemValid = (value) => {
        // Checar si selecciono Purple Air
        if(value.label === 'PurpleAir'){
            // Checar si esta seleccionado otro contaminante que no sea PM25
            if(gas.value !== 'PM25'){
                setGas(indicadores[0]);
            }
        }
    }

    return (
        <div className="container mt-5">
            <Form>
            <Form.Row className="mapa-filtros"> 
                    <Col className="mb-4 filter-container" xs={12} lg={6}>
                        <div className='filtros'>
                            <div>
                                <p className='font-weight-bold mb-1'>Sistema</p>
                                <p style={{fontSize: "0.8rem"}} className="mb-1">Selecciona el sistema de sensores que deseas visualizar.</p>
                                <p style={{fontSize: "0.8rem"}} className="mb-1">*Recuerda que el sistema PurpleAir solo tiene disponible el contaminante PM2.5</p>
                                <Select className="mb-4"
                                    placeholder="Seleccionar"
                                    value={systemChosen}
                                    onChange={(value) => {
                                        checkIfSystemValid(value)
                                        setSystemChosen(value)
                                        setLocation(null)
                                    }}
                                    options={systemOptions}
                                />
                            </div>
                            <div>
                                <p className='font-weight-bold mb-1'>Ubicación</p>
                                <p style={{fontSize: "0.8rem"}} className="mb-1">Selecciona la ubicación que deseas resaltar (estas pueden variar dependiendo del sistema de sensores que selecciones).</p>
                                <Select
                                    placeholder="Seleccionar"
                                    value={location}
                                    onChange={setLocation}
                                    options={locationOptions}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col className="mb-4 filter-container" xs={12} lg={6}>
                        <div className='filtros'>
                            <div>
                                <p className='font-weight-bold mb-1'>Cifra</p>
                                <p style={{fontSize: "0.8rem"}} className="mb-1">Selecciona la cifra que deseas calcular.</p>
                                    <Select className=""
                                        options={intervalos}
                                        onChange={setInterval_}
                                        value={interval}
                                    />
                            </div>

                            <div>
                                <p className='filtro-material font-weight-bold mb-1'>Contaminante</p>
                                <Button
                                    className="btn-info"
                                    block
                                    onClick={handleShow}
                                >
                                    ?
                                </Button>
                                <p style={{fontSize: "0.8rem"}} className="mb-1">Selecciona el contaminante que deseas filtrar.</p>
                                <Select 
                                    options={indOptions}
                                    value={gas}
                                    onChange={setGas}
                                />
                            </div>
                        </div>
                        {/* <Col xs={2}>
                        <OverlayTrigger
                        key='top'
                        placement='top'
                        overlay={
                            <Tooltip>
                            Info. indicadores
                            </Tooltip>
                        }
                        >
                            <Button className="info-btn" variant="link" onClick={handleShow }>
                                <BsInfoCircle color="MediumVioletRed" />
                            </Button>
                        </OverlayTrigger>
                            
                        </Col> */}
                    </Col>
                </Form.Row>
            </Form>
  
            <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Indicadores</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <h3 className="mod-sub"><a href="https://comiteecologicointerescolar.org/2022/02/23/efectos-a-la-salud-pm10-y-pm2-5"><span className="mod-ind morado">PM 10</span></a>&emsp; Material Particulado menor a 10 micrómetros</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Mezcla compleja de partículas líquidas o sólidas que provienen de fuentes naturales o de fuentes antropogénicas, poseen un tamaño aerodinámico menor a 10 micrómetros.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><a href="https://comiteecologicointerescolar.org/2022/02/23/efectos-a-la-salud-pm10-y-pm2-5"><span className="mod-ind morado">PM 2.5</span></a>&emsp; Material Particulado menor a 2.5 micrómetros</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Mezcla Compleja de Partículas líquidas o sólidas que provienen principalmente de fuentes antropogénicas, poseen un tamaño aerodinámico menor a 2.5 micrómetros.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><a href="https://comiteecologicointerescolar.org/2022/02/23/efectos-a-la-salud-de-ozono"><span className="mod-ind morado">O3</span></a>&emsp; Ozono</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Gas compuesto por 3 átomos de oxigeno que se encuentra principalmente en la estratosfera, puede formarse a nivel superficial debido a condiciones de alta radiación y temperatura.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><a href="https://comiteecologicointerescolar.org/2022/02/23/efectos-a-la-salud-de-monoxido-de-carbono"><span className="mod-ind morado">CO</span></a>&emsp; Monóxido de Carbono</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Gas incoloro que se forma principalmente por la combustión de gasolinas, leña o carbón, este compuesto, en altas concentraciones puede ser muy nocivo a la salud.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><a href="https://comiteecologicointerescolar.org/2022/02/23/efectos-a-la-salud-de-dioxido-de-azufre"><span className="mod-ind morado">SO2</span></a>&emsp; Dióxido de Azufre</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Es un gas formado por 2 átomos de oxígeno y uno de azufre, se forma principalmente por la combustión de combustibles fósiles con alto contenido de azufre.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><a href="https://comiteecologicointerescolar.org/2022/02/23/efectos-a-la-salud-de-oxidos-de-nitrogeno"><span className="mod-ind morado">NO2</span></a>&emsp; Dióxido de Nitrógeno</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Molécula con 2 átomos de oxígeno y uno de Nitrógeno que se produce principalmente por la combustión de combustibles fósiles empleados en vehículos y plantas de energía.</p>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Cerrar
                </Button>
            </Modal.Footer>
            </Modal>

        </div>
    );
};

export default MapaFiltros;
