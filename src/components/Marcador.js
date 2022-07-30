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
import { Button, Form, Col, Row, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import { getStatus } from '../handlers/statusCriteria';


const showLabel = (label) => {
    if (typeof label != 'number') return label;
    let fixed = 0;
    if(label.toFixed(2) == 0) {
        fixed = label.toFixed(4);
    } else {
        fixed = label.toFixed(2);
    }
    if (parseInt(fixed) === label) return label
    return fixed;
};

const renderMarker = (label, status, shape = 'round', currentLocation, locationStr) => {
    return (
        <div
            className={`${currentLocation === locationStr ? 'marker-wrapper-selected' : 'marker-wrapper'}`}
            // style={currentLocation === locationStr ? { zIndex: 1 } : { zIndex: shape === 'round' ? -1 : -10 }}
        >
            <div
                className={`marker-${status} marker-base marker-shape-${shape} ${currentLocation === locationStr ? 'marker-border marker-size-' : ''}`}
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
    currentLocation,
    ICAR_PM25,
    ICAR_PM10,
    ICAR_O3_8h,
    ICAR_O3_1h,
    ICAR_CO,
    ICAR_NO2,
    ICAR_SO2,
    sensor_id,
    humedad,
    temperatura,
    label,
    status,
    position,
    current,
    provider,
    locationStr,
    labels,
    urlMI,
    lastUpdate,
    map,
    shape = 'round',
    ...props
}) {
    const marker = useMemo(() => document.createElement('div'), []);
    const popupRef = useRef();
    const [icon, setIcon] = useState(null);

    const updateMarker = useCallback(
        (label_, status_, currentLocation_, locationStr_) => {
            ReactDOM.render(renderMarker(label_, status_, shape, currentLocation_, locationStr_), marker);

            setIcon(
                divIcon({
                    html: marker,
                    className: `sensor-icon ${currentLocation_ === locationStr_ ? 'top' : shape === 'round' ? '' : 'behind'}`,
                    popupAnchor: [7, 0],
                })
            );
        },
        [shape]
    );

    useEffect(() => {
        updateMarker(label, status, currentLocation, locationStr);
    }, [label, status, updateMarker, currentLocation]);
    
    function getStatusColor(label) {
        if(label === 'PM2.5') {
            if(ICAR_PM25 == '-1.00' || ICAR_PM25 == '0.00') {
                return 99;
            } else {
                return getStatus('PM25', ICAR_PM25);
            }
        } else if(label === 'PM10') {
            if(ICAR_PM10 == '-1.00' || ICAR_PM10 == '0.00') {
                return 99;
            } else {
                return getStatus(label, ICAR_PM10);
            }
        } else if(label === 'O3') {
            if(ICAR_O3_8h >= ICAR_O3_1h) {
                if(ICAR_O3_8h == '-1.00' || ICAR_O3_8h == '0.00') {
                    return 99;
                } else {
                    return getStatus(label, ICAR_O3_8h);
                }
            } else {
                if(ICAR_O3_1h == '-1.00' || ICAR_O3_1h == '0.00') {
                    return 99;
                } else {
                    return getStatus(label, ICAR_O3_1h);
                }
            }
        } else if(label === 'CO') {
            if(ICAR_CO == '-1.00' || ICAR_CO == '0.00') {
                return 99;
            } else {
                return getStatus(label, ICAR_CO);
            }
        } else if(label === 'NO2') {
            if(ICAR_NO2 == '-1.00' || ICAR_NO2 == '0.00') {
                return 99;
            } else {
                return getStatus(label, ICAR_NO2);
            }
        } else if(label === 'SO2') {
            if(ICAR_SO2 == '-1.00' || ICAR_SO2 == '0.00') {
                return 99;
            } else {
                return getStatus(label, ICAR_SO2);
            }
        }
    }

    if (!icon) return null;

    return (

//         <Marker
//   position={[latitude, longitude]}
//   icon={getIcon(markerType)}
//   eventHandlers={{
//     mouseover: (event) => event.target.openPopup(),
//   }}
// >
//   <Popup>Hello</Popup>
// </Marker>;

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

                    <Row className='data-label'>
                        <Col xs={5}>
                            <small className="text-muted">Humedad</small>
                            <br />
                            <data>{humedad + ' %'}</data>
                        </Col>
                        <Col xs={5}>
                            <small className="text-muted">Temperatura</small>
                            <br />
                            <data>{temperatura  + ' ºC'}</data>
                        </Col>
                    </Row>

                    <div className="data-label">
                        <small className="text-muted">
                            Concentración horaria
                        </small>
                        <br />
                        <time>
                            {moment(lastUpdate).format("LL, LT")}
                        </time>
                    </div>

                    <Row className='d-flex justify-content-between'>
                        <Col xs={3}>
                        </Col>
                        <Col xs={5}>
                            <small className="text-muted">Concentración horaria</small>
                        </Col>
                        <Col xs={4}>
                            <small className="text-muted">ICAR*</small>
                        </Col>
                    </Row>

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
                                    <Col className={`d-flex justify-content-between px-1 rounded marker-${getStatusColor(label)}`} xs={3}>
                                
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
                                <Col xs={3}>
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
                                <Col className={`d-flex justify-content-between px-1 rounded marker-${getStatusColor(label)}`} xs={3}>
                            
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
                                    ICAR_O3_8h >= ICAR_O3_1h ?
                                    ICAR_O3_8h == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_O3_8h == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_O3_8h.toFixed(3)}</span>
                                    :
                                    ICAR_O3_1h == '-1.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    ICAR_O3_1h == '0.00' ?
                                    <span>{'ND'}</span>
                                    :
                                    <span>{ICAR_O3_1h.toFixed(3)}</span>
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
                    <div className="data-label">
                        <small className="text-muted">
                            *Índice de acuerdo a la {' '}
                            <a className='text-black' href="https://www.dof.gob.mx/nota_detalle.php?codigo=5579387&fecha=20/11/2019#gsc.tab=0"> NOM-172-SEMARNAT-2019 </a>{' '}
                        </small>
                    </div>
                <div className="py-2 px-3 border-top text-center">
                    <Button size="sm">
                        <a style={{ color: 'white' }} target='blank' href={urlMI}>Más información</a>
                    </Button>
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
     * url para boton de Mas Informacion
     */
    urlMI: PropTypes.string,

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
