/**
 * Mapa.js
 *
 * This file defines the MapPage component, which renders an interactive map
 * displaying real-time air quality sensor data across the main populated areas
 * of Nuevo León.
 *
 * Features:
 * - Real-time hourly pollutant data visualization
 * - Interactive filters to select intervals and contaminants
 * - Dynamic markers with legends and information panels
 *
 * Dependencies:
 * - React (hooks, components)
 * - Redux (state management)
 * - Leaflet (map rendering)
 * - Bootstrap (UI layout and components)
 *
 *
 * Last updated: [?]
 */


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Offcanvas } from "react-bootstrap";

import Wrapper from "./components/WrapperMapa.js";
import { TablaCalidad } from "./components/TablaCalidad.js";

import { intervalos } from "./constants.js";

// Styles
import "./styles/MapLegend.css"
import MainForm, { customStyles } from "./components/MainForm/index.js";
import { getSystemSensorsMetadata } from "./services/sensorService.js";
import CustomMarker from "./components/Marker.js";

const sensores_new = await getSystemSensorsMetadata("AireNuevoLeon");

const mapDefaultProps = {
  center: [25.67, -100.25],
  zoom: 12,
  minZoom: 10,
};

/**
 * MapPage Component
 * Renders the main interactive map displaying real-time air quality data
 * with filters, markers, and legends for the monitored areas.
 *
 * Uses:
 * - Redux state: location, contaminant
 * - Hooks: useSensorData, useState, useEffect, useCallback, useMemo
 * - Child components: Wrapper, Marcador, MapaFiltros, TablaCalidad
 *
 * @returns {JSX.Element} The rendered MapPage component.
 */

function MapPage() {
  const { location, contaminant } = useSelector((state) => state.form);
  const [map, setMap] = useState(null);
  const [currentInterval, setCurrentInterval] = useState(intervalos[0]);
  const [show, setShow] = useState(false);

  // Sets the map's center point when the selected location changes
  useEffect(() => {
    if (!location) return;
    const setCenter = (pos) => {
      if (map) {
        map.setView(pos, mapDefaultProps.zoom, {
          animate: true,
        });
      }
    }
    setCenter([location?.value.address.lat, location?.value.address.lon]);
  }, [location, map]);


  return (
    <div>
      <MapInfo show={show} setShow={setShow}/>
      <MainForm
        otherSelects={{
          title: "Índice",
          placeholder: "Medida",
          options: intervalos,
          onChange: setCurrentInterval,
          value: currentInterval,
          styles: customStyles
        }
        }
      />
      <div
        className="z-0"
        style={{
          position: "relative",
          height: "calc(100vh - 144px)",
        }}
      >
        <Button
          variant="outline-info"
          className="p-2 m-1 position-absolute start-0 z-1 bg-white bg-opacity-50"
          onClick={() => setShow(true)}>
          info
        </Button>
        <div className="bg-white bg-opacity-50 position-absolute bottom-0 z-1">
          <TablaCalidad gas={contaminant?.value || ""} />
        </div>
        <Wrapper setMap={setMap} {...mapDefaultProps}>
          {
            sensores_new.map(
              (sensor, index) => <CustomMarker
                key={index}
                sensor_id={sensor.ID}
                address={sensor.Address}
                currentInterval={currentInterval}
              />
            )
          }
        </Wrapper>
      </div>
    </div>
  );
}

const MapInfo = ({show, setShow}) => <Offcanvas show={show} onHide={() => setShow(false)}>
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

export default MapPage;
