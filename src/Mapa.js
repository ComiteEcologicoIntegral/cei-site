import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Recomendaciones from './components/Recomendaciones.js';
import MapaFiltros from './components/MapaFiltros.js';
import Marcador from './components/Marcador.js';
import Wrapper from './components/WrapperMapa.js';

import { gases, mapBlacklist } from './constants.js';
import { getStatus } from './handlers/statusCriteria.js';
import useSensorData from './hooks/useSensorData.js';
import { Spinner, OverlayTrigger, Popover, Button } from 'react-bootstrap';
const mapDefaultProps = {
    center: [25.67, -100.25],
    zoom: 11,
    minZoom: 10,
};

function Mapa() {
    const [currentGas, setCurrentGas] = useState(gases[0]);
    const {
        data: sensorData,
        loading: loadingSensorData,
        error: errorSensorData,
    } = useSensorData({});

    const [map, setMap] = useState(null);
    // const [lastCenter, setLastCenter] = useState(null);

    const setCenter = useCallback(
        (pos) => {
            if (map) {
                // setLastCenter(pos);
                map.setView(pos, mapDefaultProps.zoom, {
                    animate: true,
                });
            }
        },
        [map]
    );

    const markers = useMemo(() => {
        const filteredSensors = sensorData.filter(
            (sensor) =>
                typeof sensor.Longitud === 'number' &&
                typeof sensor.Latitud === 'number' &&
                !mapBlacklist.includes(sensor.Sistema)
        );

        return filteredSensors.map((data) => {
            const { name: gasName, units: gasUnits } = currentGas;

            let preValue =
                gasName === 'PM25'
                    ? data.Sistema === 'PurpleAir'
                        ? data['PM25_Promedio']
                        : data[gasName]
                    : data[gasName];

            const value = typeof preValue === 'number' ? preValue : 'ND';

            return {
                position: [data.Latitud, data.Longitud],
                current: {
                    indicator: currentGas.label ? currentGas.label : gasName,
                    label: value,
                    units: gasUnits,
                    status: value !== 'ND' ? getStatus(gasName, value) : 99,
                    ref: '#',
                },
                lastUpdate: new Date(data.Dia),
                locationStr: data.Zona?.length > 0 ? data.Zona : 'ND',
                provider: {
                    name: data.Sistema,
                    ref: '#',
                },
                isPurpleAir: data.Sistema === 'PurpleAir',
                labels: gases.map(({ name, label, units }) => {
                    let colName = name;
                    if (name === 'PM25' && data.Sistema === 'PurpleAir')
                        colName = 'PM25_Promedio';
                    return {
                        label: label ? label : name,
                        units,
                        value:
                            typeof data[colName] === 'number'
                                ? data[colName]
                                : 'ND',
                        status: data[colName]
                            ? getStatus(name, data[colName])
                            : 99,
                        ref: '#',
                    };
                }),
            };
        });
    }, [sensorData, currentGas]);

    return (
        <div>
            <MapaFiltros
                onApply={({ gas, location }) => {
                    if (location) {
                        // encuentra sensor al que le corresponde la ubicación de los filtros
                        const fSensor = sensorData.find(
                            (record) => record.Sensor_id === location.value
                        );

                        if (fSensor) {
                            setCenter([fSensor.Latitud, fSensor.Longitud]);
                        }
                    }

                    if (gas) {
                        const nGas = gases.find(
                            (gas_) => gas_.name === gas.label
                        );
                        setCurrentGas(nGas ?? currentGas);
                    }
                }}
            />
            <div
                className="my-4"
                style={{
                    zIndex: 0,
                    position: 'relative',
                    width: '100%',
                    height: '500px',
                }}
            >
                {errorSensorData && (
                    <div
                        className="position-absolute w-100 end-0 p-2"
                        style={{ zIndex: 100 }}
                    >
                        <div class="alert alert-danger" role="alert">
                            Ocurrió un error al cargar los datos.
                        </div>
                    </div>
                )}
                {loadingSensorData && (
                    <div
                        className="w-100 h-100 d-flex position-absolute"
                        style={{
                            zIndex: 100,
                            backgroundColor: 'rgba(0,0,0,0.2)',
                        }}
                    >
                        <div className="position-absolute top-50 start-50 translate-middle">
                            <Spinner animation="border" />
                        </div>
                    </div>
                )}
                <div
                    className="w-100 h-100 position-absolute p-2"
                    style={{ zIndex: 99, pointerEvents: 'none' }}
                >
                    <div className="position-absolute end-0">
                        <OverlayTrigger
                            trigger="click"
                            placement={'left'}
                            overlay={
                                <Popover>
                                    <Popover.Title as="h3">
                                        Leyenda
                                    </Popover.Title>
                                    <Popover.Content>
                                        <div className="d-flex align-items-center">
                                            <div
                                                style={{
                                                    boxSizing: 'border-box',
                                                    borderRadius: '100%',
                                                    width: '35px',
                                                    height: '20px',
                                                    marginRight: '0.75rem',
                                                    padding: 0,
                                                    border: '1px solid black',
                                                }}
                                            ></div>
                                            Los sensores del estado se
                                            representan con un círculo
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div
                                                style={{
                                                    boxSizing: 'border-box',
                                                    width: '28px',
                                                    height: '20px',
                                                    marginRight: '0.75rem',
                                                    padding: 0,
                                                    border: '1px solid black',
                                                }}
                                            ></div>
                                            Los sensores de Purple Air se
                                            representan con un cuadrado
                                        </div>
                                    </Popover.Content>
                                </Popover>
                            }
                        >
                            <Button variant="link" className="pe-auto">
                                Leyenda
                            </Button>
                        </OverlayTrigger>
                    </div>
                </div>
                <Wrapper whenCreated={setMap} {...mapDefaultProps}>
                    {!loadingSensorData &&
                        markers.map((markerProps, idx) => (
                            <Marcador
                                map={map}
                                key={idx}
                                {...markerProps}
                                label={markerProps.current.label}
                                indicator={markerProps.current.indicator}
                                status={markerProps.current.status}
                                shape={
                                    markerProps.isPurpleAir ? 'square' : 'round'
                                }
                            />
                        ))}
                </Wrapper>
            </div>
            <Recomendaciones />
        </div>
    );
}

export default Mapa;
