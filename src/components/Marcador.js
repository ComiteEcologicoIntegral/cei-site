import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Marker, Popup } from 'react-leaflet';

/**
 * Marcador
 * @augments {Component<Props, State>}
 */
class Marcador extends Component {
    constructor(props) {
        super(props);
        this.updateMarker(this.props.label, this.props.status);
    }

    updateMarker(label, status) {
        const html = document.createElement('div');
        html.style.width = 50;

        ReactDOM.render(this.renderMarker(label, status), html);

        this.icon = divIcon({
            html,
            className: 'sensor-icon',
            popupAnchor: [7, 0],
        });
    }

    componentDidUpdate() {
        this.updateMarker(this.props.label, this.props.status);
    }

    makeTint(borderColor, bgColor) {
        return {
            backgroundColor: bgColor,
            // border: `1px solid ${borderColor}`,
        };
    }

    getTintByStatus(status) {
        switch (status) {
            case 'red':
                return this.makeTint('red', 'rgba(255, 0, 0, 0.5)');
            case 'orange':
                return this.makeTint('orange', 'rgba(255, 128, 0, 0.5)');
            case 'yellow':
                return this.makeTint('yellow', 'rgba(255, 255, 0, 0.5)');
            case 'green':
                return this.makeTint('green', 'rgba(0, 204, 0, 0.5)');
            default:
                return this.makeTint('gray', 'rgba(0, 0, 0, 0.3)');
        }
    }

    renderMarker(label, status) {
        return (
            <div
                style={{
                    fontSize: '18px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...this.getTintByStatus(status),
                }}
            >
                {label}
            </div>
        );
    }

    render() {
        const {
            position,
            status,
            labels,
            provider,
            locationStr,
        } = this.props;

        return (
            <Marker position={position} icon={this.icon}>
                <Popup
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
                            className="rounded"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '0 0.1rem ',
                                ...this.getTintByStatus(status),
                            }}
                        >
                            {this.props.indicator}: {this.props.label}
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
                                {new Date(
                                    this.props.lastUpdate
                                ).toLocaleString()}
                            </time>
                        </div>
                        <div className="data-label">
                            <small className="text-muted">Tiempo Real</small>
                        </div>
                        <div>
                            {labels.map(
                                ({ label, status, value, ref }, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex justify-content-between rt-data-row mb-1"
                                    >
                                        <a href={ref}>{label}</a>
                                        <span
                                            className="rounded"
                                            style={{
                                                backgroundColor: this.getTintByStatus(
                                                    status
                                                ).backgroundColor,
                                            }}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="py-2 px-3 border-top text-center">
                        <button className="btn btn-primary btn-sm">
                            Más información
                        </button>
                        <p className="lh-sm mt-2 mb-0">
                            Fuente(s):{' '}
                            <a href={provider.ref}>{provider.name}</a>
                        </p>
                    </div>
                </Popup>
            </Marker>
        );
    }
}

Marcador.defaultProps = {};

Marcador.propTypes = {
    /**
     * Etiqueta del indicador que muestra el popup
     */
    indicator: PropTypes.string,

    /**
     * Valor del indicador
     */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Estado del indicador (['red', 'orange', 'yellow', 'green'])
     */
    status: PropTypes.oneOf(['red', 'orange', 'yellow', 'green']),

    /**
     * Fecha de la ultima actualización del sensor en milisegundos
     */
    lastUpdate: PropTypes.number,

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
            label: PropTypes.string,
            status: PropTypes.oneOf(['red', 'orange', 'yellow', 'green']),
            ref: PropTypes.string,
        })
    ),
};

export default Marcador;
