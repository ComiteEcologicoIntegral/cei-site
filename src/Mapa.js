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


// React and third party libraries
import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Offcanvas } from "react-bootstrap";
import { BsFillInfoSquareFill } from "react-icons/bs";

// Componentes retrieved directly from components
import MapaFiltros from "./components/MapaFiltros.js";
import Marcador from "./components/Marcador.js";
import Wrapper from "./components/WrapperMapa.js";
import { TablaCalidad } from "./components/TablaCalidad.js";

// Constants and Utilities
import { gases, mapBlacklist, idBlacklist, unidad } from "./constants.js";
import { getICAR } from "./handlers/statusCriteria.js";
import useSensorData from "./hooks/useSensorData.js";

// Styles
import "./styles/MapLegend.css"
import MainForm, { CustomSelect, customStyles } from "./components/MainForm/index.js";
import Select from "react-select/base";
import { getSensorLocationsBySystem } from "./handlers/data.js";
import { getSystemSensorsMetadata } from "./services/sensorService.js";


/**
 * Default map properties
 * Defines initial center coordinates [latitud, longitud] , zoom level, and minus zoom
 */

const sensores_new = await getSystemSensorsMetadata("AireNuevoLeon");

const mapDefaultProps = {
  center: [25.67, -100.25],
  zoom: 12,
  minZoom: 10,
};

const intervalos = [
  { value: 0, label: 'Indice Calidad Aire' },
  { value: 1, label: 'Concentracion horaria' },
]

/**
 * LegendItem component
 * Render a legend item with an optional icon and text label.
 *
 *
 * @param {Object} props - Component props.
 * @param {string} props.text - The label text to display.
 * @param {string} [props.icon] - Optional icon image URL.
 * @returns {JSX.Element} Rendered legend item component.
 *
 */

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

  // Extract location and contaminant data from Redux state
  const { location, contaminant } = useSelector((state) => state.form);

  // Local state for selected interval (e.g. hourly or daily data)
  const [currentInterval, setCurrentInterval] = useState(intervalos[0]);

  /**
  * useSensorData
  *
  * Custom React hook that retrieves real-time air quality sensor data
  * from the backend API and returns it in a structured format.
  *
  */

  const { sensorData } = useSensorData();

  // Local state to store map instance reference
  const [map, setMap] = useState(null);

  // Local state to control visibility of info off-canvas panel
  const [show, setShow] = useState(false);

  // useCallback to set map center when location changes
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

  // useEffect hook that sets the map's initial center point
  // when the location state changes.

  useEffect(() => {
    if (!location) return;
    setCenter([location?.value.address.lat, location?.value.address.lon]);
  }, [location, setCenter]);



  // Dictionary that maps Sensor IDs to their assigned station names.

  const ANLKeys_dict = {
    ANL1: "SURESTE",
    ANL2: "NORESTE",
    ANL3: "SUROESTE",
    ANL4: "[SAN Pedro]",
    ANL5: "NORTE2",
    ANL6: "GARCIA",
    ANL7: "NOROESTE",
    ANL8: "SURESTE3",
    ANL9: "NORTE",
    ANL10: "NORESTE2",
    ANL11: "SUR",
    ANL12: "CENTRO",
    ANL13: "SURESTE2",
    ANL15: "PESQUERIA",
    ANL16: "MITRAS"
  };


  /**
   * getValue
   * Formats a pollutant value based on its type while ensuring valid output
   *
   * @param {number} preValue - Raw numeric value from the API.
   * @param {string} gasName - The gas name used to determine decimal precision.
   * Returns the formatted value with appropriate decimals, or null if invalid.”
   *
   * Format the pollutant value based on gas type:
   * Use 4 decimal places for NO2 or SO2, otherwise use 2 decimals.
   */

  const getValue = (preValue, gasName) => {
    if (!preValue || typeof preValue !== "number" || preValue < 0) {
      return null;
    }

    let ans;
    if (gasName === "NO2" || gasName === "SO2") {
      ans = +preValue.toFixed(4);
    } else {
      ans = +preValue.toFixed(2);
    }
    return ans;
  }


  /**
   * filterND
   * Converts undefined, null, or empty string values to "ND" (No Data),
   * otherwise returns the data as a string.
   *
   * @param {*} data - The data value to check and format.
   * @returns {string} "ND" if data is undefined, null, or empty; otherwise the data as string.
   */

  const filterND = (data) => {
    return typeof data === "undefined" || data === null || data === ""
      ? "ND"
      : data.toString()
  }

  /**
  * Memoized calculation of map markers.
  *
  * Returns an empty array if no contaminant is selected.
  *
  * @returns {Array} Array of marker objects for rendering on the map,
  * or an empty array if contaminant is not defined.
  */
  const markers = useMemo(() => {
    if (!contaminant) return [];

    /**
     * - Filters sensorData to include only sensors with:
     * - Valid numeric longitude and latitude coordinates.
     * - Systems not included in mapBlacklist.
     * - Sensor IDs not included in idBlacklist.
     */

    const filteredSensors = sensorData?.filter(
      (sensor) =>
        typeof sensor.Longitud === "number" &&
        typeof sensor.Latitud === "number" &&
        !mapBlacklist.includes(sensor.Sistema) &&
        !idBlacklist.includes(sensor.Sensor_id)
    );

    // Maps each filtered sensor to a marker data object,
    // extracting the selected gas name and its units for further processing.
    const resultingData = filteredSensors?.map((data) => {
      const { value: gasName } = contaminant;
      const gasUnits = unidad[gasName];

      /**
       * Determines the appropriate dataKey to extract pollutant values based on currentInterval:
       * - If currentInterval === 0: uses ICAR indicator for the gas.
       * For O3 in AireNuevoLeon, selects the greater between 1-hour and 8-hour values.
       * - If currentInterval === 1: uses raw gas value.
       * For PM25 in PurpleAir, appends "_Promedio" to access averaged data.
       */

      let dataKey;
      if (currentInterval.value === 0) {
        dataKey = `ICAR_${gasName}`;
        if (data.Sistema === "AireNuevoLeon" && gasName === "O3") {
          if (data[`${dataKey}_1h`] >= data[`${dataKey}_8h`]) {
            dataKey += "_1h";
          }
          else {
            dataKey += "_8h";
          }
        }
      }
      else if (currentInterval.value === 1) {
        dataKey = gasName;
        if (gasName === "PM25" && data.Sistema === "PurpleAir") {
          dataKey += "_Promedio";
        }
      }


      // Formats the pollutant value retrieved from data[dataKey]
      // using getValue to apply appropriate decimal precision based on gasName.
      const intValue = getValue(data[dataKey], gasName);

      // Determine final value : If intValue is valid, use it; otherwise set as "ND".
      const value = toString(intValue) ? intValue : "ND";

      /**
       * Build and return marker data object for current sensor,
       * including:
       * - Location and pollutant data
       * - Calculated air quality indicators (ICAR, OMS, AQI)
       * - Provider URLs and metadata
       * - Labels for each gas with formatted values and statuses
       */

      return {
        currentLocation: location,
        ICAR_PM25: +data.ICAR_PM25,
        OMS_PM25: +data.OMS_PM25,
        AQI_PM25: +data.AQI_PM25,
        ICAR_PM10: +data.ICAR_PM10,
        OMS_PM10: +data.OMS_PM10,
        AQI_PM10: +data.AQI_PM10,
        ICAR_O3_8h: +data.ICAR_O3_8h,
        ICAR_O3_1h: +data.ICAR_O3_1h,
        OMS_O3: +data.OMS_O3,
        AQI_O3: +data.AQI_O3,
        ICAR_CO: +data.ICAR_CO,
        OMS_CO: +data.OMS_CO,
        AQI_CO: +data.AQI_CO,
        ICAR_NO2: +data.ICAR_NO2,
        OMS_NO2: +data.OMS_NO2,
        AQI_NO2: +data.AQI_NO2,
        ICAR_SO2: +data.ICAR_SO2,
        OMS_SO2: +data.OMS_SO2,
        AQI_SO2: +data.AQI_SO2,
        sensor_id: data.Sensor_id,
        humedad: filterND(data.Humedad_R),
        temperatura: filterND(data.Temperatura_C),
        position: [data.Latitud, data.Longitud],
        current: {
          indicator: contaminant?.label ? contaminant?.label : gasName,
          label: filterND(value),
          units: gasUnits,
          status: getICAR(intValue, gasName, "ssa"),
          ref: "#",
        },
        lastUpdate: moment.utc(data.Dia).local(),
        locationStr: data.Zona?.length > 0 ? data.Zona : "ND",
        provider: {
          name: data.Sistema,
          ref: (() => {
            if (data.Sistema === "PurpleAir")
              return "https://www.purpleair.com/map?mylocation";
            if (data.Sistema === "AireNuevoLeon")
              return "http://aire.nl.gob.mx/";
            if (data.Sistema === "Sinaica")
              return "https://sinaica.inecc.gob.mx/";
            return "#";
          })(),
        },
        isPurpleAir: data.Sistema === "PurpleAir",
        labels: gases.map(({ name, label, units }) => {
          let colName = name;
          if (name === "PM25" && data.Sistema === "PurpleAir")
            colName = "PM25_Promedio";
          // Map each gas to its label, units, formatted value, and status.
          return {
            label: label ? label : name,
            units: units,
            value: filterND(data[colName]),
            status: getICAR(data[colName], name, "ssa"),
            ref: "#",
          };
        }),

        // Generate provider-specific URL for "More Information" button.
        urlMI: (() => {
          if (data.Sistema === "PurpleAir")
            return (
              "https://map.purpleair.com/1/mAQI/a10/p0/cC0?select=" +
              data.Sensor_id.substr(1) +
              "#13.91/" +
              data.Latitud +
              "/" +
              data.Longitud
            );
          if (data.Sistema === "AireNuevoLeon")
            return (
              "http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=" +
              ANLKeys_dict[data.Sensor_id]
            );
          if (data.Sistema === "Sinaica")
            return "https://sinaica.inecc.gob.mx/";
          return "#";
        })(),
      };
    });

    /**
     * Render map page layout including:
     * - Offcanvas information panel
     * - Filter controls and legend
     * - Map wrapper with markers
     */
    return resultingData;
  }, [sensorData, contaminant, currentInterval, location]);

  const MapInfo = () => <Offcanvas show={show} onHide={() => setShow(false)}>
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

  const Leyend = () =>
    <div className="legend-width p-1 m-2 d-flex position-absolute bottom-0 z-1">
      <div className="mt-2">
        <h5>Leyenda</h5>
        <LegendItem text={"Sensores del Estado"} icon={"images/sensor_estado.png"} />
        <LegendItem text={"Sensores PurpleAir"} icon={"images/sensor_purple_air.png"} />
        <LegendItem text={"No hay datos"} icon={"images/no_data.png"} />
      </div>
    </div>

  return (
    <div>
      <MapInfo />
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
            // Old
            markers.map((markerProps, idx) => {
              if (!markerProps) return '';
              if (contaminant?.value === "PM25" || !markerProps?.isPurpleAir) {
                return (
                  <Marcador
                    map={map}
                    key={idx}
                    isPurpleAir={markerProps.isPurpleAir}
                    {...markerProps}
                    label={markerProps.current.label}
                    indicator={markerProps.current.indicator}
                    status={markerProps.current.status}
                    shape={markerProps.isPurpleAir ? "square" : "round"}
                  />
                );
              }
            })
            // New
            // sensores_new.map(
            //   (sensor, idx) => {
            //     return (
            //       <Marcador
            //         // address = {[data.Address.Latitud, data.Address.Longitud]}
            //       />
            //     );
            //   }
            // )
          }
        </Wrapper>
      </div>
    </div>
  );
}

export default MapPage;
