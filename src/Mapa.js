import React, { useCallback, useEffect, useMemo, useState } from "react";
import MapaFiltros from "./components/MapaFiltros.js";
import Marcador from "./components/Marcador.js";
import Wrapper from "./components/WrapperMapa.js";

import { gases, mapBlacklist, idBlacklist, unidad } from "./constants.js";
import { getICAR } from "./handlers/statusCriteria.js";
import useSensorData from "./hooks/useSensorData.js";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Offcanvas } from "react-bootstrap";
import { BsFillInfoSquareFill } from "react-icons/bs";
import "./styles/MapLegend.css"
import { TablaCalidad } from "./components/TablaCalidad.js";
import useSystemLocations from "./hooks/useSystemLocations.js";

const mapDefaultProps = {
  center: [25.67, -100.25],
  zoom: 12,
  minZoom: 10,
};

const LegendItem = (props) => {
  const { text, icon } = props;

  return (
    <div
      className="legend-item"
      style={{ border: "1px dashed gray" }}
    >
      {icon && (
        <div className="legend-item-icon">
          <img src={icon} alt={"Legend Icon"} />
        </div>
      )}
      <div className="legend-item-text">{text}</div>
    </div>
  );
};

function MapPage() {
  const { location, contaminant, system } = useSelector((state) => state.form);
  const { locations } = useSystemLocations(system.value);

  const [currentInterval, setCurrentInterval] = useState(0);

  const [map, setMap] = useState(null);
  const [show, setShow] = useState(false);

  const setCenter = useCallback(
    (pos) => {
      if (map) {
        map.setView(pos, mapDefaultProps.zoom, {
          animate: true,
        });
      }
    },
    [map]
  );

  useEffect(() => {
    if (!location) return;
    setCenter([location?.value.address.lat, location?.value.address.lon]);
  }, [location, setCenter]);


  return (
    <div>
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Calidad del aire en tiempo real</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>
            Consulta información en tiempo real sobre la calidad del aire en
            Monterrey
          </p>
          <p>
            En esta página puedes ver información en tiempo real acerca de la
            calidad del aire en Monterrey, si deseas obtener información más
            específica puedes hacer uso de los filtros de abajo.
          </p>
        </Offcanvas.Body>
      </Offcanvas>

      <div
        className="z-0"
        style={{
          position: "relative",
          height: "calc(100vh - 91px)",
          margin: "0 auto",
        }}
      >

        <Button variant="outline-info" className="position-absolute start-0 top-0 z-1" onClick={() => setShow(true)}>
          info
        </Button>
        <MapaFiltros
          onApply={({ interval }) => {
            if (interval) {
              setCurrentInterval(interval.value);
            }

          }}
        />
        <div className="legend-width p-1 m-2 d-flex position-absolute bottom-0 z-1">
          <div className="mt-2">
            <h5>Leyenda</h5>
            <LegendItem text={"Sensores del Estado"} icon={"images/sensor_estado.png"} />
            <LegendItem text={"Sensores PurpleAir"} icon={"images/sensor_purple_air.png"} />
            <LegendItem text={"No hay datos"} icon={"images/no_data.png"} />
          </div>
          <TablaCalidad gas={contaminant?.value || ""} />
        </div>
        <Wrapper setMap={setMap} {...mapDefaultProps}>
          {
            locations.map((loc, idx) => {
              return (
                <Marcador
                  map={map}
                  key={idx}
                  sensorId={loc.value.id}
                  position={[loc.value.address.lat, loc.value.address.lon]}
                />
              );
            })}
        </Wrapper>
      </div>
    </div>
  );
}

export default MapPage;
