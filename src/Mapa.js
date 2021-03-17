import React from 'react';
import Recomendaciones from './components/Recomendaciones.js';
import MapaFiltros from './components/MapaFiltros.js';
import Marcador from './components/Marcador.js';
import Wrapper from './components/WrapperMapa.js';

// Datos de prueba de marcadores
const markers = [
    {
        position: [51.505, -0.09],
        current: {
            label: 57,
            indicator: 'MP10',
            status: 'orange',
        },
        lastUpdate: Date.now(),
        locationStr: 'Ubicacion',
        provider: {
            name: 'Purple Air',
            ref: '/purple-air',
        },
        labels: [
            {
                label: 'PM10',
                value: '50',
                status: 'red',
                ref: '#',
            },
            {
                label: 'PM2.5',
                value: 50,
                status: 'green',
                ref: '#',
            },
            {
                label: 'O3',
                value: 50,
                status: 'yellow',
                ref: '#',
            },
            {
                label: 'CO',
                value: 50,
                status: 'red',
                ref: '#',
            },
            {
                label: 'NO2',
                value: 50,
                status: 'red',
                ref: '#',
            },
            {
                label: 'SO2',
                value: 50,
                status: 'orange',
                ref: '#',
            },
        ],
    },
];

const center = [51.505, -0.09];

function Mapa() {
    return (
        <div>
            <MapaFiltros />
            <div
                className="my-4"
                style={{
                    width: '100%',
                    height: '500px',
                }}
            >
                <Wrapper center={center}>
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
