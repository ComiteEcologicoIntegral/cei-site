import React, {
    Component,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Marker, Popup } from 'react-leaflet';
import { Button } from 'react-bootstrap';

const renderMarker = (label, status) => {
    return (
        <div
            className={`marker-${status}`}
            style={{
                fontSize: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {label}
        </div>
    );
};

/**
 * Marcador
 * @augments {Component<Props, State>}
 */
function Marcador({
    label,
    status,
    position,
    current,
    provider,
    locationStr,
    labels,
    lastUpdate,
    map,
    ...props
}) {
    const marker = useMemo(() => document.createElement('div'), []);
    const popupRef = useRef();
    const [icon, setIcon] = useState(null);

    const updateMarker = useCallback(
        (label_, status_) => {
            ReactDOM.render(renderMarker(label_, status_), marker);

            setIcon(
                divIcon({
                    html: marker,
                    className: 'sensor-icon',
                    popupAnchor: [7, 0],
                })
            );
        },
        [marker]
    );

    useEffect(() => {
        updateMarker(label, status);
    }, [label, status, updateMarker]);

    if (!icon) return null;

    return (
        <Marker position={position} icon={icon} {...props}>
            <Popup
                ref={popupRef}
                className="custom-popup"
                closeButton={(props) => (
                    <button
                        {...props}
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                    ></button>
                )}
            >
                <div className="px-3 py-2">
                    <div
                        className={`rounded marker-${current.status}`}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '0 0.1rem ',
                        }}
                    >
                        {current.indicator}: {current.label} {current.units}
                    </div>
                    <div className="data-label">
                        <small className="text-muted">Ubicación</small>
                        <br />
                        <data>{locationStr}</data>
                    </div>
                    <div className="data-label">
                        <small className="text-muted">
                            Última actualización
                        </small>
                        <br />
                        <time>{new Date(lastUpdate).toLocaleString()}</time>
                    </div>
                    <div className="data-label">
                        <small className="text-muted">Tiempo Real</small>
                    </div>
                    <div>
                        {labels.map(
                            ({ label, status, value, units, ref }, idx) => (
                                <div
                                    key={idx}
                                    className="d-flex justify-content-between rt-data-row mb-1"
                                >
                                    <a href={ref}>{label}</a>
                                    <div
                                        className={`d-inline-flex justify-content-between px-1 rounded marker-${status}`}
                                    >
                                        <span>{value}</span>
                                        <span>{units}</span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="py-2 px-3 border-top text-center">
                    <Button size="sm">Más información</Button>
                    <p className="lh-sm mt-2 mb-0">
                        Fuente(s): <a href={provider.ref}>{provider.name}</a>
                    </p>
                </div>
            </Popup>
        </Marker>
    );
}

Marcador.defaultProps = {};

Marcador.propTypes = {
    /**
     * Etiqueta del indicador que muestra el popup
     */
    indicator: PropTypes.string,

    /**
     * Informacion del indicador que muestra el popup
     */
    current: PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        status: PropTypes.number,
        units: PropTypes.string,
    }),

    /**
     * Fecha de la ultima actualización del sensor en milisegundos
     */
    lastUpdate: PropTypes.instanceOf(Date),

    /**
     * Etiqueta de la ubicación del sensor
     */
    locationStr: PropTypes.string,

    /**
     * LatLng del marcador
     */
    position: PropTypes.arrayOf(PropTypes.number),

    /**
     * Informacion de la fuente del sensor (e.g. Purple Air, Sinaica, etc.)
     */
    provider: PropTypes.shape({
        name: PropTypes.string,
        ref: PropTypes.string,
    }),

    /**
     * Informacion de todos los indicadores del sensor
     */
    labels: PropTypes.arrayOf(
        PropTypes.shape({
            indicator: PropTypes.string,
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            status: PropTypes.number,
            units: PropTypes.string,
            ref: PropTypes.string,
        })
    ),
};

export default Marcador;
