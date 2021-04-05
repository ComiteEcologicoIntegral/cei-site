import { useState } from 'react'
import { Form, Modal, Button, Col, Row, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { BsInfoCircle } from "react-icons/bs";
import Select, { components } from 'react-select';

const indicadores = [
    {value: 'PM25', label: 'PM25'},
    {value: 'PM10', label: 'PM10'},
    {value: 'O3', label: 'O3'},
    {value: 'CO', label: 'CO'},
    {value: 'NO2', label: 'NO2'},
    {value: 'SO2', label: 'SO2'}
]

const intervalos =  [
    {value: '1', label: 'Tiempo real'},
    {value: '2', label: '12 horas'},
    {value: '3', label: '24 horas'},
    {value: '4', label: 'Última semana'},
    {value: '5', label: 'Último mes'},
    {value: '6', label: 'Último año'}
]

const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

const MapaFiltros = ({onApply}) => {
    const [show, setShow] = useState(false);
    const [location, setLocation] = useState('');
    const [interval, setInterval] = useState(intervalos[0]);
    const [gas, setGas] = useState('');
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="container mt-5">
            <Form>
                <Form.Row className="mapa-filtros">
                    <Col className="mb-3" xs={12} lg={4}>
                    <Form.Control placeholder="Ubicación" onChange={(e) => setLocation(e.target.value)} value={location}/>
                    </Col>
                    <Col className="mb-3" xs={6} lg={3}>
                    <Select 
                    options={intervalos} 
                    onChange={setInterval}
                    value={interval}
                    />
                    </Col>
                    <Col xs={6} lg={3}>
                        <Row>
                            <Col xs={10}>
                                <Select 
                                options={indicadores} 
                                value={gas}
                                onChange={setGas}
                                />
                            </Col>
                            <Col xs={2}>
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
                                
                            </Col>
                        </Row>
                    </Col>
                    <Col>

                        <Button className="btn-aplicar" variant="primary" block onClick={() => onApply({gas, location, interval})}>
                            Aplicar
                        </Button>

                    </Col>
                </Form.Row>
            </Form>
  
            <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Indicadores</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <h3 className="mod-sub"><span className="mod-ind morado">PM 10</span>&emsp; Material Particulado menor a 10 micrómetros</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Mezcla compleja de partículas líquidas o sólidas que provienen de fuentes naturales o de fuentes antropogénicas, poseen un tamaño aerodinámico menor a 10 micrómetros.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><span className="mod-ind morado">PM 2.5</span>&emsp; Material Particulado menor a 2.5 micrómetros</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Mezcla Compleja de Partículas líquidas o sólidas que provienen principalmente de fuentes antropogénicas, poseen un tamaño aerodinámico menor a 2.5 micrómetros.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><span className="mod-ind morado">O2</span>&emsp; Ozono</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Gas compuesto por 3 átomos de oxigeno que se encuentra principalmente en la estratosfera, puede formarse a nivel superficial debido a condiciones de alta radiación y temperatura.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><span className="mod-ind morado">CO</span>&emsp; Monóxido de Carbono</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Gas incoloro que se forma principalmente por la combustión de gasolinas, leña o carbón, este compuesto, en altas concentraciones puede ser muy nocivo a la salud.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><span className="mod-ind morado">SO2</span>&emsp; Dióxido de Azufre</h3>
                </Row>
                <Row>
                    <p className="mod-desc">Es un gas formado por 2 átomos de oxígeno y uno de azufre, se forma principalmente por la combustión de combustibles fósiles con alto contenido de azufre.</p>
                </Row>
                <Row>
                    <h3 className="mod-sub"><span className="mod-ind morado">NO2</span>&emsp; Dióxido de Nitrógeno</h3>
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
    )
}

export default MapaFiltros
