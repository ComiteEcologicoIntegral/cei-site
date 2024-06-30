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
  const { location, contaminant } = useSelector((state) => state.form);

  const [currentInterval, setCurrentInterval] = useState(0);
  const { sensorData } = useSensorData();

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



  //Diccionario para pasar de Sensor_id a nombre de estacion
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

  const filterND = (data) => {
    return typeof data === "undefined" || data === null || data === ""
      ? "ND"
      : data.toString()
  }

  const markers = useMemo(() => {
    if (!contaminant) return [];
    // TODO: sensors should be filtered by the backend
    const filteredSensors = sensorData?.filter(
      (sensor) =>
        typeof sensor.Longitud === "number" &&
        typeof sensor.Latitud === "number" &&
        !mapBlacklist.includes(sensor.Sistema) &&
        !idBlacklist.includes(sensor.Sensor_id)
    );


    const resultingData = filteredSensors?.map((data) => {
      const { value: gasName } = contaminant;
      const gasUnits = unidad[gasName];


      /* Current Interval === 0 -> Presenta el value del indicador de calidad del aire */
      let dataKey;
      if (currentInterval === 0) {
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
      else if (currentInterval === 1) {
        dataKey = gasName;
        if (gasName === "PM25" && data.Sistema === "PurpleAir") {
          dataKey += "_Promedio";
        }
      }
      const intValue = getValue(data[dataKey], gasName);
      const value = toString(intValue) ? intValue : "ND";

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
          return {
            label: label ? label : name,
            units: units,
            value: filterND(data[colName]),
            status: getICAR(data[colName], name, "ssa"),
            ref: "#",
          };
        }),

        //url para boton de Mas Informacion
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

    return resultingData;
  }, [sensorData, contaminant, currentInterval, location]);

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
            })}
        </Wrapper>
      </div>
    </div>
  );
}

export default MapPage;
