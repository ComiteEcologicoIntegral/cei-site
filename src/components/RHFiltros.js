import React from 'react';
import { Form, ButtonGroup, Button, Col } from 'react-bootstrap';
import Select, { components } from 'react-select';
import { NavLink } from 'react-router-dom';

const sensores = [
    {value : 'S1', label: 'Pastora'},
    {value : 'S2', label: 'San Nicolás'},
    {value : 'S3', label: 'Santa Catarina'},
    {value : 'S4', label: 'San Pedro'},
    {value : 'S5', label: 'Universidad'}
]

const indicadores = [
    {value: 'PM25', label: 'PM25'},
    {value: 'PM10', label: 'PM10'},
    {value: 'O3', label: 'O3'},
    {value: 'CO', label: 'CO'},
    {value: 'NO2', label: 'NO2'},
    {value: 'SO2', label: 'SO2'}
]

const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

function RHFiltros() {
    return (
        <div className="mt-5">
            <div className="ta-center mb-5">
                <h2>Registro Histórico</h2>
                <p>Consulta los datos históricos de la calidad del aire</p>
            </div>
            <Form>
                <Form.Row className="mb-3">
                        <Col xs={12}>
                            <Select 
                            isMulti 
                            options={sensores}
                            placeholder={'Ubicación'}
                            />
                        </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <ButtonGroup aria-label="Basic example">
                            <NavLink to="/registro" activeClassName="rh-active">
                                <Button className="rh-btn" variant="outline-light">Grafica</Button>
                            </NavLink> 
                            <NavLink to="/calendario" activeClassName="rh-active">         
                                <Button className="rh-btn" variant="outline-light">Calendario</Button>
                            </NavLink>     
                        </ButtonGroup>
                    </Col>
                    <Col className="mb-3">
                        <Select
                        options={indicadores}
                        placeholder={'Indicador'}
                        />
                    </Col>
                    <Col xs={12} sm={3} className="mb-3">
                        <Button className="btn-aplicar" variant="primary" block>
                            Aplicar
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <hr className="mt-2 mb-4"/>
        </div>
    )
}

export default RHFiltros
