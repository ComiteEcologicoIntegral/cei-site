import React, { useState } from 'react';
import { Form, ButtonGroup, Button, Col, ToggleButton } from 'react-bootstrap';
import Select from 'react-select';

const sensores = [
    {value : 'S1', label: 'Pastora'},
    {value : 'S2', label: 'San Nicolás'},
    {value : 'S3', label: 'Santa Catarina'},
    {value : 'S4', label: 'San Pedro'},
    {value : 'S5', label: 'Universidad'}
]

const indicadores = [
    {value: 'PM25', label: 'PM2.5'},
    {value: 'PM10', label: 'PM10'},
    {value: 'O3', label: 'O3'},
    {value: 'CO', label: 'CO'},
    {value: 'NO2', label: 'NO2'},
    {value: 'SO2', label: 'SO2'}
]

function RHFiltros({createQuery, radioValue, setRadioValue}) {
    
    const radios = [
        { name: 'Grafica', value: '1' },
        { name: 'Calendario', value: '2' }
    ];

    const [ind, setInd] = useState({value: "PM25"});
    const [ubic, setUbic] = useState(null);
    
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
                            onChange={(value) => setUbic(value)}
                            />
                        </Col>
                </Form.Row>
                <Form.Row>
                    <Col>
                        <ButtonGroup toggle>
                            {radios.map((radio, idx) => (
                            <ToggleButton
                                className="toggle-vista"
                                key={idx}
                                type="radio"
                                variant="light"
                                name="radio"
                                value={radio.value}
                                checked={radioValue === radio.value}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                            ))}      
                        </ButtonGroup>
                    </Col>
                    <Col className="mb-3">
                        <Select
                        options={indicadores}
                        placeholder={'Indicador'}
                        onChange={(value) => setInd(value)}
                        defaultValue={indicadores[0]}
                        />
                    </Col>
                    <Col xs={12} sm={3} className="mb-3">
                        <Button className="btn-aplicar" variant="primary" block
                            onClick={() => createQuery(ind, ubic)}
                        >
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
