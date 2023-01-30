import React, { useCallback, useMemo, useState } from "react";
import MapaFiltros from "./components/MapaFiltros.js";
import Marcador from "./components/Marcador.js";
import Wrapper from "./components/WrapperMapa.js";
import Legend from "./components/MapLegend/MapLegend"
import { TablaCalidad } from "./components/TablaCalidad.js";

import { gases, mapBlacklist, idBlacklist } from "./constants.js";
import { getStatus, getStatusClassName } from "./handlers/statusCriteria.js";
import useSensorData from "./hooks/useSensorData.js";
import { Spinner } from "react-bootstrap";
import moment from "moment";

const mapDefaultProps = {
  center: [25.67, -100.25],
  zoom: 11,
  minZoom: 10,
};

function Mapa() {
  const [showHideState, setshowHideState] = useState(1);
  const [currentGas, setCurrentGas] = useState(gases[0]);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const {
    data: sensorData,
    loading: loadingSensorData,
    error: errorSensorData,
  } = useSensorData({});

  const [map, setMap] = useState(null);

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
    return typeof data === "undefined" || data === null
            ? "N/D"
            : data.toString()
  }

  const markers = useMemo(() => {
    // TODO: sensors should be filtered by the backend
    const filteredSensors = sensorData.filter(
      (sensor) =>
        typeof sensor.Longitud === "number" &&
        typeof sensor.Latitud === "number" &&
        !mapBlacklist.includes(sensor.Sistema) &&
        !idBlacklist.includes(sensor.Sensor_id)
    );

    const resultingData = filteredSensors.map((data) => {
      const { name: gasName, units: gasUnits } = currentGas;

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
        if (gasName === "PM25") {
          dataKey += "_Promedio";
        }
      }
      
      const intValue = getValue(data[dataKey], gasName);
      const value = intValue ? intValue : "ND";

      return {
        currentLocation,
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
          indicator: currentGas.label ? currentGas.label : gasName,
          label: value,
          units: gasUnits,
          status: getStatusClassName(intValue, gasName, "ssa"),
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
            status: getStatusClassName(data[colName], name, "ssa"),
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
  }, [sensorData, currentGas, currentInterval, currentLocation]);

  return (
    <div>
      <div className="MapaIntro ta-center mt-5">
        <h2>Calidad del aire en tiempo real</h2>
        <p>
          Consulta información en tiempo real sobre la calidad del aire en
          Monterrey
        </p>
      </div>
      <div className="mapa-info mt-5 mb-3">
        <p>
          En esta página puedes ver información en tiempo real acerca de la
          calidad del aire en Monterrey, si deseas obtener información más
          específica puedes hacer uso de los filtros de abajo.
        </p>
      </div>
      <MapaFiltros
        onApply={({ gas, location, interval }) => {
          if (interval) {
            setCurrentInterval(interval.value);
          }

          if (gas) {
            const nGas = gases.find((gas_) => gas_.name === gas.value);
            setCurrentGas(nGas ?? currentGas);
          }

          if (location) {
            // Encuentra sensor al que le corresponde la ubicación de los filtros
            const fSensor = sensorData.find(
              (record) => record.Sensor_id === location.value
            );

            if (fSensor) {
              setCurrentLocation(fSensor.Zona);
              setCenter([fSensor.Latitud, fSensor.Longitud]);
            }
          }
        }}
      />
      <div
        className="my-4 ta-center map-container position-relative"
        style={{
          zIndex: 0,
          position: "relative",
          height: "90vh",
          margin: "0 auto",
        }}
      >
        {loadingSensorData && (
          <div
            className="w-100 h-100 d-flex position-absolute"
            style={{
              zIndex: 100,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <div className="position-absolute top-50 start-50 translate-middle">
              <Spinner animation="border" />
            </div>
          </div>
        )}

        <Legend showHideState={showHideState} setshowHideState={setshowHideState}/>

        <Wrapper whenCreated={setMap} {...mapDefaultProps}>
          {!loadingSensorData &&
            markers.map((markerProps, idx) => {
              if (currentGas.name === "PM25" || !markerProps.isPurpleAir) {
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
      <TablaCalidad gas={currentGas.name} />
    </div>
  );
}

export default Mapa;
