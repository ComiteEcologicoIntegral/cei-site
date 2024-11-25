import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import { Button, Container, Col, Row } from "react-bootstrap";
import moment from "moment";
import { getStatusClassName } from "../handlers/statusCriteria";
import { getStatusOMS } from "../handlers/statusCriteria";
import { getICAR } from "../handlers/statusCriteria";
import "./Marcador.css";

const fixedValues = {
  PM25: 2,
  PM10: 0,
  O3: 3,
  CO: 2,
  NO2: 4,
  SO2: 4,
};

const isDataValid = (data) => {
  return data >= 0;
}

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

/**
 * Marcador
 * @augments {Component<Props, State>}
 */
function Marcador({
  position,
  sensorId,
  status,
}) {

  const [icon, setIcon] = useState(
    divIcon({
      html: "<div>marker<div>",
      className: "sensor-icon",
      popupAnchor: [7, 0],
    })
  );
  const renderMarker = (label, status, shape = "round") => {
    return (
      <div
        className="marker-wrapper"
      >
        <div
          className={`marker-${status} marker-base marker-shape-${shape}`}
        ></div>
        <span className={`marker-${status}`} style={{ backgroundColor: "transparent" }}>
          {showLabel(label)}
        </span>
      </div>
    );
  };
  const renderToHTMLString = (component) => {
    return ReactDOMServer.renderToString(component);
  };
  // const marker = useMemo(() => document.createElement("div"), []);
  useEffect(() => {
    setIcon(
      divIcon({
        html: renderToHTMLString(renderMarker("lable", "good")),
        className: "sensor-icon",
        popupAnchor: [7, 0],
      })
    );
  }, [status]);

  const [data, setData] = useState({});
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (!opened) return;
    console.log("fetching marker data of sensor", sensorId);
  }, [opened]);

  return (
    <Marker
      position={position}
      onClick={(event) => event.target.openPopup()}
      icon={icon}
      eventHandlers={{
        popupopen: () => {
          setOpened(true);
        }
      }}
    >
      <Popup maxWidth={1700}>hello</Popup>
    </Marker>
  );
}

export default Marcador;
