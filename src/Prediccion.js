import "./App.css";
import React, { useMemo, useState } from "react";
import MapaFiltros from "./components/MapaFiltros.js";
import { gases, mapBlacklist, idBlacklist } from "./constants.js";
import { getStatus, airQualityTags } from "./handlers/statusCriteria.js";
import useSensorData from "./hooks/useSensorData.js";
import moment from "moment";

function Prediccion() {
  const [showHideState, setshowHideState] = useState(1);
  const [currentGas, setCurrentGas] = useState(gases[0]);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const {
    data: sensorData,
    loading: loadingSensorData,
    error: errorSensorData,
  } = useSensorData({});

  const airQualityIndex = useMemo(() => {
    if (sensorData == null) {
      return 0;
    }

    let highestAirQualityIndex = 0;

    const filteredSensors = sensorData.filter(
      (sensor) =>
        typeof sensor.Longitud === "number" &&
        typeof sensor.Latitud === "number" &&
        !mapBlacklist.includes(sensor.Sistema) &&
        !idBlacklist.includes(sensor.Sensor_id)
    );

    filteredSensors.map((data) => {
      const { name: gasName, units: gasUnits } = currentGas;

      let preValue = 0;
      // Presenta el value del indicador de calidad del aire
      const prefix = "ICAR_";
      // Checar el mas alto de los O3
      preValue =
        gasName === "O3"
          ? data.Sistema === "AireNuevoLeon"
            ? data[`${prefix}O3_1h`] >= data[`${prefix}O3_8h`]
              ? data[`${prefix}O3_1h`]
              : data[`${prefix}O3_8h`]
            : data[`${prefix}${gasName}`]
          : data[`${prefix}${gasName}`];

      // Si no hay ICAR desplegar la concentración
      if (preValue === -1) {
        preValue = null;
      }

      if (typeof preValue === "number") {
        if (gasName === "NO2" || gasName === "SO2") {
          preValue = +preValue.toFixed(4);
        } else {
          preValue = +preValue.toFixed(2);
        }
      }

      const value = typeof preValue === "number" ? preValue : "ND";

      const gasStatus = getStatus(gasName, value);
      if (gasStatus > highestAirQualityIndex) {
        highestAirQualityIndex = gasStatus;
      }
    });

    return highestAirQualityIndex;
  }, [sensorData, currentGas]);

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
  };

  const markers = useMemo(() => {
    const filteredSensors = sensorData.filter(
      (sensor) =>
        typeof sensor.Longitud === "number" &&
        typeof sensor.Latitud === "number" &&
        !mapBlacklist.includes(sensor.Sistema) &&
        !idBlacklist.includes(sensor.Sensor_id)
    );

    const resultingData = filteredSensors.map((data) => {
      const { name: gasName, units: gasUnits } = currentGas;

      let preValue = null;
      /* Current Interval === 0 -> Presenta el value del indicador de calidad del aire */
      if (currentInterval === 0) {
        // Presenta el value del indicador de calidad del aire
        const prefix = "ICAR_";
        // Checar el mas alto de los O3
        preValue =
          gasName === "O3"
            ? data.Sistema === "AireNuevoLeon"
              ? data[`${prefix}O3_1h`] >= data[`${prefix}O3_8h`]
                ? data[`${prefix}O3_1h`]
                : data[`${prefix}O3_8h`]
              : data[`${prefix}${gasName}`]
            : data[`${prefix}${gasName}`];

        // Si no hay ICAR desplegar la concentración
        if (preValue === -1) {
          preValue = null;
        }
      } else if (currentInterval === 1) {
        // Current Interval === 1 -> Presenta el value de la concentracion horaria
        // Presenta el value de la concentracion (tiempo real)
        preValue =
          gasName === "PM25"
            ? data.Sistema === "PurpleAir"
              ? data["PM25_Promedio"]
              : data[gasName]
            : data[gasName];
      }

      if (typeof preValue === "number") {
        if (gasName === "NO2" || gasName === "SO2") {
          preValue = +preValue.toFixed(4);
        } else {
          preValue = +preValue.toFixed(2);
        }
      }

      const value = typeof preValue === "number" ? preValue : "ND";

      return {
        currentLocation,
        ICAR_PM25: +data.ICAR_PM25,
        ICAR_PM10: +data.ICAR_PM10,
        ICAR_O3_8h: +data.ICAR_O3_8h,
        ICAR_O3_1h: +data.ICAR_O3_1h,
        ICAR_CO: +data.ICAR_CO,
        ICAR_NO2: +data.ICAR_NO2,
        ICAR_SO2: +data.ICAR_SO2,
        sensor_id: data.Sensor_id,
        humedad:
          typeof data.Humedad_R === "undefined" || data.Humedad_R === null
            ? "N/D"
            : data.Humedad_R.toString(),
        temperatura:
          typeof data.Temperatura_C === "undefined" ||
          data.Temperatura_C === null
            ? "N/D"
            : data.Temperatura_C.toString(),
        position: [data.Latitud, data.Longitud],
        current: {
          indicator: currentGas.label ? currentGas.label : gasName,
          label: value,
          units: gasUnits,
          status: value !== "ND" ? getStatus(gasName, value) : 99,
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
            units,
            value: typeof data[colName] === "number" ? data[colName] : "ND",
            status: data[colName] ? getStatus(name, data[colName]) : 99,
            ref: "#",
          };
        }),
      };
    });

    return resultingData;
  }, [sensorData, currentGas, currentInterval, currentLocation]);  
  return (
    <div className="container mt-5">
      <div className="ta-center mb-5">
        <h2>Predicción</h2>
        <p>Consulta la predicción de la calidad del aire</p>
      </div>
      <hr className="mb-4" />
      <div>
        <p>Pasos para generar la predicción:</p>
        <ol>
          <li>
            Selecciona los filtros que deseas aplicar.
            </li>
          </ol>
      </div>
      <div>
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
            }
          }
        }}
      />
      </div>
      <br></br>
      <div class="tableDiv">
        <h3 class="stationName" >{currentLocation}</h3>
        <div id="table-wrapper">
        <div id="table-scroll">
        <table class="predictionTable">
          <thead>
            <tr>
              <th class="superTableSpace">HORARIO</th>
              <th>L</th>
              <th>M</th>
              <th>M</th>
              <th>J</th>
              <th>V</th>
              <th>S</th>
              <th>D</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="titleH">Madrugada 12:00 am - 6:00 am</th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
            </tr>
            <tr>
              <th class="titleH">Mañana 6:00 am - 12:00 pm</th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
            </tr>
            <tr>
              <th class="titleH">Tarde 12:00 pm - 6:00 pm</th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
            </tr>
            <tr>
              <th class="titleH" align="center">Noche 6:00 pm - 12:00 am</th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#73022C" }}></th>
              <th style={{ backgroundColor: "#73022C" }}></th>
              <th style={{ backgroundColor: "#73022C" }}></th>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      </div>
    </div>
  );
}
export default Prediccion;