import React, { useState } from 'react';
import Recomendaciones from './components/Recomendaciones.js';
import MapaFiltros from './components/MapaFiltros.js';
import Marcador from './components/Marcador.js';
import Wrapper from './components/WrapperMapa.js';

// Datos de prueba de marcadores
// TODO: Obtener datos desde DB
import recordData from './handlers/last-records.json';
import sensorData from './handlers/sensors.json';

import { gases } from './constants.js';
import { getStatus } from './handlers/statusCriteria.js';


const filteredSensors = sensorData.filter(
    (sensor) =>
        typeof sensor.Longitud === 'number' &&
        typeof sensor.Latitud === 'number'
);

const center = [25.67, -100.25];

function Mapa() {
    const [currentGas, setCurrentGas] = useState(gases[0]);
    const markers = recordData
        .filter((record) =>
            filteredSensors.map((s) => s.Sensor_id).includes(record.Sensor_id)
        )
        .map((data) => {
            const sensor = filteredSensors.find(
                (s) => data.Sensor_id === s.Sensor_id
            );
            const { name: gasName, units: gasUnits } = currentGas;

            return {
                position: [sensor.Longitud, -sensor.Latitud],
                current: {
                    indicator: gasName,
                    label: data[gasName] ?? 'ND',
                    units: gasUnits,
                    status: data[gasName]
                        ? getStatus(gasName, data[gasName])
                        : 99,
                    ref: '#',
                },
                lastUpdate: new Date(data.Dia),
                locationStr: sensor.Zona ?? 'ND',
                provider: {
                    name: 'Purple Air',
                    ref: '/purple-air',
                },
                labels: gases.map(({ name, units }) => ({
                    label: name,
                    units,
                    value: data[name] ?? 'ND',
                    status: data[name] ? getStatus(name, data[name]) : 99,
                    ref: '#',
                })),
            };
        });

    return (
        <div>
            <MapaFiltros
                onSelect={(value) =>
                    setCurrentGas(
                        gases.find((gas) => gas.name === value) ?? currentGas
                    )
                }
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
                <Wrapper center={center} >
                    {markers.map((markerProps, idx) => (
                        <Marcador
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
