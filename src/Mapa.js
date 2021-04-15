import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Recomendaciones from './components/Recomendaciones.js';
import MapaFiltros from './components/MapaFiltros.js';
import Marcador from './components/Marcador.js';
import Wrapper from './components/WrapperMapa.js';

import { gases } from './constants.js';
import { getStatus } from './handlers/statusCriteria.js';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorData } from './redux/reducers.js';
import moment from 'moment';
import { fetchSummaryData } from './handlers/data.js';

const mapDefaultProps = {
    center: [25.67, -100.25],
    zoom: 13,
    minZoom: 10,
};

function Mapa() {
    const { sensorDataLastUpdate, sensorData } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [currentGas, setCurrentGas] = useState(gases[0]);
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

    useEffect(() => {
        // Llama a la api si los datos se guardaron hace menos de una hora
        const diff = sensorDataLastUpdate
            ? moment().diff(sensorDataLastUpdate, 'minutes')
            : 999; // Caso sensorDataLastUpdate == null, se tienen que solicitar los datos
        if (diff > 60) {
            fetchSummaryData()
                .then((data) => {
                    dispatch(setSensorData(data));
                })
                .catch((err) => console.error(err));
        }
    }, []);

    const markers = useMemo(() => {
        const filteredSensors = sensorData.filter(
            (sensor) =>
                typeof sensor.Longitud === 'number' &&
                typeof sensor.Latitud === 'number'
        );

        return filteredSensors.map((data) => {
            const { name: gasName, units: gasUnits } = currentGas;

            return {
                position: [data.Longitud, -data.Latitud],
                current: {
                    indicator: gasName,
                    label:
                        typeof data[gasName] === 'number'
                            ? data[gasName]
                            : 'ND',
                    units: gasUnits,
                    status: data[gasName]
                        ? getStatus(gasName, data[gasName])
                        : 99,
                    ref: '#',
                },
                lastUpdate: new Date(data.Dia),
                locationStr: data.Zona?.length > 0 ? data.Zona : 'ND',
                provider: {
                    name: 'Purple Air',
                    ref: '/purple-air',
                },
                labels: gases.map(({ name, units }) => ({
                    label: name,
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
                            setCenter([fSensor.Longitud, -fSensor.Latitud]);
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
                <Wrapper whenCreated={setMap} {...mapDefaultProps}>
                    {markers.map((markerProps, idx) => (
                        <Marcador
                            map={map}
                            key={idx}
                            {...markerProps}
                            label={markerProps.current.label}
                            indicator={markerProps.current.indicator}
                            status={markerProps.current.status}
                        />
                    ))}
                </Wrapper>
            </div>
            <Recomendaciones />
        </div>
    );
}

export default Mapa;
