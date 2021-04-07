import React, { Component } from 'react';

import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import '../styles/marker.css';
import { MapContainer, TileLayer } from 'react-leaflet';

/**
 * Wrapper
 * @augments {Component<Props, State>}
 */
function Wrapper({ center, children, ...props }) {
    return (
        <MapContainer
            center={center}
            scrollWheelZoom={false}
            style={{
                height: '100%',
                widht: '100%',
            }}
            {...props}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright
                    ">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    );
}

Wrapper.defaultProps = {};

Wrapper.propTypes = {
    /**
     * Nodos hijos del mapa (solo elementos de leaflet)
     */
    children: PropTypes.node,

    /**
     * Un arreglo [lat, lng] con la posición del centro del mapa
     */
    center: PropTypes.arrayOf(PropTypes.number),

    setMap: PropTypes.func,
};

export default Wrapper;
