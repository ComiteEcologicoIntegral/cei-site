import React, { useCallback, useMemo, useState } from "react";
import Recomendaciones from "./components/Recomendaciones.js";
import MapaFiltros from "./components/MapaFiltros.js";
import Marcador from "./components/Marcador.js";
import Wrapper from "./components/WrapperMapa.js";

import { gases, mapBlacklist, idBlacklist } from "./constants.js";
import { getStatus, airQualityTags } from "./handlers/statusCriteria.js";
import useSensorData from "./hooks/useSensorData.js";
import { Spinner, OverlayTrigger, Popover, Button } from "react-bootstrap";
import moment from "moment";

const mapDefaultProps = {
  center: [25.67, -100.25],
  zoom: 11,
  minZoom: 10,
};

function Mapa() {
  const [currentGas, setCurrentGas] = useState(gases[0]);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null)
  const {
    data: sensorData,
    loading: loadingSensorData,
    error: errorSensorData,
  } = useSensorData({});

  const [map, setMap] = useState(null);

  const setCenter = useCallback(
    (pos) => {
      if (map) {
        // setLastCenter(pos);
        map.setView(pos, mapDefaultProps.zoom, {
          animate: true,
        });
      }
    },
    [map]
  );

  const airQualityIndex = useMemo(
    () => {
      if (sensorData == null) {
        console.log("No data yet");
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

        let preValue =
          gasName === "PM25"
            ? data.Sistema === "PurpleAir"
              ? data["PM25_Promedio"]
              : data[gasName]
            : data[gasName];

        const value = typeof preValue === "number" ? preValue : "ND";

        const gasStatus = getStatus(gasName, value);
        if (gasStatus > highestAirQualityIndex) {
          highestAirQualityIndex = gasStatus;
        }
      });

      return highestAirQualityIndex;
    },  
    [sensorData, currentGas]
  );

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
      if(currentInterval === 0){
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
        if(preValue === -1) {
          preValue = null;
        }
      } else if(currentInterval === 1){ // Current Interval === 1 -> Presenta el value de la concentracion horaria
        // Presenta el value de la concentracion (tiempo real)
        preValue =
          gasName === "PM25"
            ? data.Sistema === "PurpleAir"
              ? data["PM25_Promedio"]
              : data[gasName]
            : data[gasName];
      }

      if(typeof preValue === "number") {
        if(gasName === "NO2" || gasName === "SO2") {
          preValue = +preValue.toFixed(4);
        } else {
          preValue = +preValue.toFixed(2);
        }
      }

      const value = typeof preValue === "number" ? preValue : "ND";

      // const gasStatus = getStatus(gasName, value);
      // if (gasStatus > highestAirQualityIndex) {
      //   highestAirQualityIndex = gasStatus;
      // }

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
    <div>
      <MapaFiltros
        onApply={({ gas, location, interval }) => {
          if(interval) {
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
        className="my-4"
        style={{
          zIndex: 0,
          position: "relative",
          width: "100%",
          height: "500px",
        }}
      >
        {errorSensorData && (
          <div
            className="position-absolute w-100 end-0 p-2"
            style={{ zIndex: 100 }}
          >
            <div class="alert alert-danger" role="alert">
              Ocurrió un error al cargar los datos.
            </div>
          </div>
        )}
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
        <div
          className="w-100 h-100 position-absolute p-2"
          style={{ zIndex: 99, pointerEvents: "none" }}
        >
          <div className="position-absolute end-0 right-0 ">
            <div className="leyenda-width">
              <h6>Leyenda</h6>
              <div className="leyenda-grid">
      
                  <div
                    style={{
                      boxSizing: "border-box",
                      borderRadius: "100%",
                      width: "20px",
                      height: "20px",
                      marginRight: "0.75rem",
                      padding: 0,
                      border: "1px solid black",
                    }}
                    className="mb-2"
                  ></div>
                  <div className="mb-2">Los sensores del estado se representan con un círculo</div>
                
                  <div
                    style={{
                      boxSizing: "border-box",
                      width: "20px",
                      height: "20px",
                      marginRight: "0.75rem",
                      padding: 0,
                      border: "1px solid black",
                    }}
                    className="mb-2"
                  ></div>
                  <div className="mb-2">Los sensores de Purple Air se representan con un cuadrado</div>
                
                  <div className="">ND</div>
                  <div>No dato</div>
                
              </div>
            </div>
            {/* <OverlayTrigger
              trigger="click"
              placement={"left"}
              overlay={
                <Popover>
                  <Popover.Title as="h3">Leyenda</Popover.Title>
                  <Popover.Content>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          boxSizing: "border-box",
                          borderRadius: "100%",
                          width: "35px",
                          height: "20px",
                          marginRight: "0.75rem",
                          padding: 0,
                          border: "1px solid black",
                        }}
                      ></div>
                      Los sensores del estado se representan con un círculo
                    </div>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          boxSizing: "border-box",
                          width: "35px",
                          height: "20px",
                          marginRight: "0.75rem",
                          padding: 0,
                          border: "1px solid black",
                        }}
                      ></div>
                      Los sensores de Purple Air se representan con un cuadrado
                    </div>
                  </Popover.Content>
                </Popover>
              }
            >
              <Button variant="link" className="pe-auto">
                Leyenda
              </Button>
            </OverlayTrigger> */}
          </div>
        </div>
        <Wrapper whenCreated={setMap} {...mapDefaultProps}>
          {!loadingSensorData &&
            markers.map((markerProps, idx) => { 
              if (currentGas.name === 'PM25') {
                return (
                  <Marcador
                    map={map}
                    key={idx}
                    {...markerProps}
                    label={markerProps.current.label}
                    indicator={markerProps.current.indicator}
                    status={markerProps.current.status}
                    shape={markerProps.isPurpleAir ? "square" : "round"}
                  />
                );
              } else {
                if(!markerProps.isPurpleAir) {
                  return (
                    <Marcador
                      map={map}
                      key={idx}
                      {...markerProps}
                      label={markerProps.current.label}
                      indicator={markerProps.current.indicator}
                      status={markerProps.current.status}
                      shape={markerProps.isPurpleAir ? "square" : "round"}
                    />
                  );

                }
              }
            })}
        </Wrapper>
      </div>
      <Recomendaciones selected={airQualityTags[airQualityIndex]} />
    </div>
  );
}

export default Mapa;
