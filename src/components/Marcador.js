import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import { Button, Container, Col, Row } from "react-bootstrap";
import moment from "moment";
import {getStatusClassName} from "../handlers/statusCriteria";

const fixedValues = {
  PM25: 2,
  PM10: 0,
  O3: 3,
  CO: 2,
  NO2: 4,
  SO2: 4,
};

const isDataValid = (data) => data >= 0;

const showLabel = (label) => {
  if (typeof label != "number") return label;
  let fixed = 0;
  if (label.toFixed(2) === 0) {
    fixed = label.toFixed(4);
  } else {
    fixed = label.toFixed(2);
  }
  if (parseInt(fixed) === label) return label;
  return fixed;
};

const renderMarker = (label, status, shape = "round", currentLocation, locationStr) => {
  return (
    <div
      className={`${
        currentLocation === locationStr ? "marker-wrapper-selected" : "marker-wrapper"
      }`}
    >
      <div
        className={`marker-${status} marker-base marker-shape-${shape} ${
          currentLocation === locationStr ? "marker-border marker-size-" : ""
        }`}
      ></div>
      <span className={`marker-${status}`} style={{ backgroundColor: "transparent" }}>
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
  OMS_PM25,
  AQI_PM25,
  ICAR_PM10,
  OMS_PM10,
  AQI_PM10,
  ICAR_O3_8h,
  ICAR_O3_1h,
  OMS_O3,
  AQI_O3,
  ICAR_CO,
  OMS_CO,
  AQI_CO,
  ICAR_NO2,
  OMS_NO2,
  AQI_NO2,
  ICAR_SO2,
  OMS_SO2,
  AQI_SO2,
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
  shape = "round",
  isPurpleAir,
  ...props
}) {
  const marker = useMemo(() => document.createElement("div"), []);
  const [icon, setIcon] = useState(null);

  const values = {
    ICAR_PM25,
    OMS_PM25,
    AQI_PM25,
    ICAR_PM10,
    OMS_PM10,
    AQI_PM10,
    ICAR_O3_8h,
    ICAR_O3_1h,
    OMS_O3,
    AQI_O3,
    ICAR_CO,
    OMS_CO,
    AQI_CO,
    ICAR_NO2,
    OMS_NO2,
    AQI_NO2,
    ICAR_SO2,
    OMS_SO2,
    AQI_SO2,
};

  
  const getICARValue = (label) => {
    const getValue = (label) => {
      if (label === "O3") {
        return Math.max(values[`ICAR_O3_8h`], values[`ICAR_O3_1h`]);
      }
      return values[`ICAR_${label}`];
    };

    let ans = getValue(label);
    if (!isDataValid(ans)) {
      return "ND";
    }
    return ans.toFixed(fixedValues[label]);
  };

  const getOMSValue = (label) => {
    let ans = values[`OMS_${label}`];
    return ans.toFixed(fixedValues);
  }

  const getAQIValue = (label) => {
    let ans = values[`AQI_${label}`];
    return ans.toFixed(fixedValues);
  }

  const updateMarker = useCallback(
    (label_, status_, currentLocation_, locationStr_) => {
      ReactDOM.render(renderMarker(label_, status_, shape, currentLocation_, locationStr_), marker);

      setIcon(
        divIcon({
          html: marker,
          className: `sensor-icon ${
            currentLocation_ === locationStr_ ? "top" : shape === "round" ? "" : "behind"
          }`,
          popupAnchor: [7, 0],
        })
      );
    },
    [shape, marker]
  );

  useEffect(() => {
    updateMarker(label, status, currentLocation, locationStr);
  }, [label, status, updateMarker, currentLocation, locationStr]);

  if (!icon) return null;

  return (
    <Marker
      position={position}
      onClick={(event) => event.target.openPopup()}
      icon={icon}
      {...props}
    >
      <Popup maxWidth={1700}>
        <div className="px-3 py-2">
          <div
            className={`rounded marker-${current.status}`}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "0 0.1rem ",
            }}
          >
            {current.indicator}: {current.label} {current.units}
          </div>

          <Row className="data-label">
            <Col xs={5}>
              <small className="text-muted">Ubicación</small>
              <br />
              <data>{locationStr}</data>
            </Col>
            <Col xs={5}>
              <small className="text-muted">Concentración horaria</small>
              <br />
              <data><time>{moment(lastUpdate).format("LL, LT")}</time></data>
            </Col>
          </Row>

          <Row className="data-label">
            <Col xs={5}>
              <small className="text-muted">Humedad</small>
              <br />
              <data>{humedad + " %"}</data>
            </Col>
            <Col xs={5}>
              <small className="text-muted">Temperatura</small>
              <br />
              <data>{temperatura + " ºC"}</data>
            </Col>
          </Row>

          <Container style={{padding: 0, width: "350px"}}>
            <Row className="flex-nowrap">
              <Col xs={2} className="px-1 m-1"></Col>
              <Col xs={3} className="px-1 m-1">
                <small className="text-muted m-1">Concentración horaria</small>
              </Col>
              <Col xs={2} className="px-1 m-1">
                <small className="text-muted m-1">ICAR*</small>
              </Col>
              <Col xs={2} className="px-1 m-1">
                <small className="text-muted m-1">OMS</small>
              </Col>
              <Col xs={2} className="px-1 m-1">
                <small className="text-muted m-1">EPA AQI</small>
              </Col>
            </Row>
            {labels.map(({label, status, value, units}, idx) => {
              if (isPurpleAir && label !="PM2.5") {
                return;
              }
              let cleanLabel = label.replace(".", "");
              let ICAR_Value = getICARValue(cleanLabel);
              let OMS_Value = getOMSValue(cleanLabel);
              let AQI_Value = getAQIValue(cleanLabel);
              return (<Row className="flex-nowrap">
                <Col xs={2}>{label}</Col>
                <Col xs={3} className={`px-1 m-1 rounded d-flex justify-content-between marker-${status}`}>
                  {value !== "ND" ? <><div>{value}</div><div> {units}</div></> : value}
                </Col>
                <Col xs={2} className={`px-1 m-1 rounded marker-${getStatusClassName(ICAR_Value, cleanLabel, "ssa")}`}>{ICAR_Value}</Col>
                <Col xs={2} className={`px-1 m-1 rounded marker-${getStatusClassName(OMS_Value, cleanLabel, "oms")}`}>{OMS_Value}</Col>
                <Col xs={2} className={`px-1 m-1 rounded marker-${getStatusClassName(AQI_Value, cleanLabel, "epaaqi")}`}>{AQI_Value}</Col>
              </Row>)
            }
            )}
          </Container>
        <div className="data-label text-center">
          <small className="text-muted">
            *Índice de acuerdo a la{" "}
            <a
              className="text-black"
              href="https://www.dof.gob.mx/nota_detalle.php?codigo=5579387&fecha=20/11/2019#gsc.tab=0"
            >
              NOM-172-SEMARNAT-2019
            </a>
          </small>
        </div>
        <div className="py-2 px-3 border-top text-center">
          <Button size="sm">
            <a style={{color: "white"}} target="blank" href={urlMI}>
              Más información
            </a>
          </Button>
          <p className="lh-sm mt-2 mb-0">
            Fuente(s):{" "}
            <a target="blank" href={provider.ref}>
              {provider.name}
            </a>
          </p>
        </div>
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
    status: PropTypes.string,
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
