import React from 'react';

import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import '../styles/marker.css';
import { MapContainer, TileLayer } from 'react-leaflet';

/**
 * Wrapper
 * @augments {Component<Props, State>}
 */
function Wrapper({ center, setMap, children, ...props }) {
    return (
        <MapContainer
            center={center}
            style={{
                height: '100%',
                width: '100%',
            }}
            ref={setMap}
            zoomControl={false}
            {...props}
        >
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png?api_key=e4368efd-701c-4da6-8372-03f4040a622a"
            />
            {children}
        </MapContainer>
    );
}

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
