import React, {
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
import { Link } from 'react-router-dom';

import { Marker, Popup } from 'react-leaflet';
import { Button,Form,Row,Col, Container } from 'react-bootstrap';
import moment from 'moment';


const showLabel = (label) => {
    if (typeof label != 'number') return label; 
    const fixed = label.toFixed(2);
    if (parseInt(fixed) === label) return label
    return fixed;
};

const renderMarker = (label, status, shape = 'round') => {
    return (
        <div
            className="marker-wrapper"
            style={{ zIndex: shape === 'round' ? -1 : -10 }}
        >
            <div
                className={`marker-${status} marker-base marker-shape-${shape}`}
            ></div>
            <span
                className={`marker-${status}`}
                style={{ backgroundColor: 'transparent' }}
            >
                {showLabel(label)}
            </span>
        </div>
    );
};

/**
 * Marcador
 * @augments {Component<Props, State>}
 */
function Marcador({
    ICAR_PM25,
    ICAR_PM10,
    ICAR_O3,
    ICAR_CO,
    ICAR_NO2,
    ICAR_SO2,
    sensor_id,
    label,
    status,
    position,
    current,
    provider,
    locationStr,
    labels,
    lastUpdate,
    map,
    shape = 'round',
    ...props
}) {
    const marker = useMemo(() => document.createElement('div'), []);
    const popupRef = useRef();
    const [icon, setIcon] = useState(null);

    const updateMarker = useCallback(
        (label_, status_) => {
            ReactDOM.render(renderMarker(label_, status_, shape), marker);

            setIcon(
                divIcon({
                    html: marker,
                    className: `sensor-icon ${
                        shape === 'round' ? '' : 'behind'
                    }`,
                    popupAnchor: [7, 0],
                })
            );
        },
        [shape]
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
                        <time>
                            {moment(lastUpdate).format(
                                'ddd, MMMM D YYYY, h:mm:ss a'
                            )}
                        </time>
                    </div>
                    <div className="data-label2">
                        <small className="text-muted">Tiempo Real</small>
                        <small className="text-muted ml-5">Indice Calidad Aire</small>
                    </div>
                    
                    <Form >
                        {labels.map(({ label, status, value, units }, idx) => (
                           sensor_id[0] === 'P' ?
                            label === 'PM2.5' ?
                                <Form.Row 
        
                                    key={idx}
                                    className="d-flex justify-content-between  mb-1 "
                                >
                                    <Col xs = {3}>
                                    <Link
                                        to={{
                                            pathname: 'registro',
                                            search: `?gas=${label}`,
                                        }}
                                        
                                    >
                                        {label}
                                    </Link>
                                    </Col>
                                    <Col className={`d-flex justify-content-between px-1 rounded marker-${status}`} xs={5}>
                                
                                    
                                        <span>{value}</span>
                                        <span>{units}</span>
                                    
                                
                                    </Col>
                                    <Col className={`d-flex justify-content-between px-1 rounded marker-${status}`} xs={3}>
                                
                                {
                                        label === 'PM2.5' ?
                                        ICAR_PM25 == '-1.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        ICAR_PM25 == '0.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        <span>{ICAR_PM25.toFixed(2)}</span>
                                        :
                                        label === 'PM10' ?
                                        ICAR_PM10 == '-1.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        ICAR_PM10 == '0.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        <span>{ICAR_PM10.toFixed(0)}</span>
                                        :
                                        label === 'O3' ?
                                        ICAR_O3 == '-1.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        ICAR_O3 == '0.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        <span>{ICAR_O3.toFixed(3)}</span>
                                        :
                                        label === 'CO' ?
                                        ICAR_CO == '-1.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        ICAR_CO == '0.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        <span>{ICAR_CO.toFixed(2)}</span>
                                        :
                                        label === 'NO2' ?
                                        ICAR_NO2 == '-1.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        ICAR_NO2 == '0.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        <span>{ICAR_NO2.toFixed(4)}</span>
                                        :
                                        label === 'SO2' ?
                                        ICAR_SO2 == '-1.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        ICAR_SO2 == '0.00' ?
                                        <span>{'ND'}</span>
                                        :
                                        <span>{ICAR_SO2.toFixed(4)}</span>
                                        :
                                        <span>{'ND'}</span>
                                } 
                            
                            </Col>
                            </Form.Row>
                            :
                            null 
                        :
                        <Form.Row 
                                
                                key={idx}
                                className="d-flex justify-content-between  mb-1 "
                            >
                                <Col xs = {3}>
                                <Link
                                    to={{
                                        pathname: 'registro',
                                        search: `?gas=${label}`,
                                    }}
                                    
                                >
                                    {label}
                                </Link>
                                </Col>
                                <Col className={`d-flex justify-content-between px-1 rounded marker-${status}`} xs={5}>
                            
                                
                                    <span>{value}</span>
                                    <span>{units}</span>
                                
                            
                                </Col>
                                <Col className={`d-flex justify-content-between px-1 rounded marker-${status}`} xs={3}>
                            
                            {
                                    label === 'PM2.5' ?
                                    ICAR_PM25 == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_PM25 == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_PM25.toFixed(2)}</span>
                                    :
                                    label === 'PM10' ?
                                    ICAR_PM10 == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_PM10 == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_PM10.toFixed(0)}</span>
                                    :
                                    label === 'O3' ?
                                    ICAR_O3 == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_O3 == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_O3.toFixed(3)}</span>
                                    :
                                    label === 'CO' ?
                                    ICAR_CO == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_CO == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_CO.toFixed(2)}</span>
                                    :
                                    label === 'NO2' ?
                                    ICAR_NO2 == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_NO2 == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_NO2.toFixed(4)}</span>
                                    :
                                    label === 'SO2' ?
                                    ICAR_SO2 == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_SO2 == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_SO2.toFixed(4)}</span>
                                    :
                                    <span>{'ND'}</span>
                            } 

                        </Col>
                        </Form.Row>
                        ))}
                    </Form>
                </div>

                <div className="py-2 px-3 border-top text-center">
                    <Button size="sm">Más información</Button>
                    <p className="lh-sm mt-2 mb-0">
                        Fuente(s): <a target='blank' href={provider.ref}>{provider.name}</a>
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
