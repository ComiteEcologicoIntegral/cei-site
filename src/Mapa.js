import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Recomendaciones from './components/Recomendaciones.js';
import MapaFiltros from './components/MapaFiltros.js';
import Marcador from './components/Marcador.js';
import Wrapper from './components/WrapperMapa.js';

import { gases, mapBlacklist } from './constants.js';
import { getStatus } from './handlers/statusCriteria.js';
import useSensorData from './hooks/useSensorData.js';
import { Spinner, Toast } from 'react-bootstrap';
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
    } = useSensorData(0);

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
                        ? data['PM25_Corregido']
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
                labels: gases.map(({ name, label, units }) => ({
                    label: label ? label : name,
                    units,
                    value: typeof data[name] === 'number' ? data[name] : 'ND',
                    status: data[name] ? getStatus(name, data[name]) : 99,
                    ref: '#',
                })),
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
                        className="position-absolute end-0 bg-danger m-1"
                        style={{ zIndex: 99 }}
                    >
                        <Toast>
                            <Toast.Body className="text-danger">
                                Ocurrió un error al cargar los datos.
                            </Toast.Body>
                        </Toast>
                    </div>
                )}
                {loadingSensorData && (
                    <div
                        className="w-100 h-100 d-flex position-absolute"
                        style={{
                            zIndex: 99,
                            backgroundColor: 'rgba(0,0,0,0.2)',
                        }}
                    >
                        <div className="position-absolute top-50 start-50 translate-middle">
                            <Spinner animation="border" />
                        </div>
                    </div>
                )}
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
