import React, { useCallback, useMemo, useState } from "react";
import Recomendaciones from "./components/Recomendaciones.js";
import MapaFiltros from "./components/MapaFiltros.js";
import Marcador from "./components/Marcador.js";
import Wrapper from "./components/WrapperMapa.js";
import { TablaCalidad } from "./components/TablaCalidad.js";

import { gases, mapBlacklist, idBlacklist } from "./constants.js";
import { getStatus, airQualityTags } from "./handlers/statusCriteria.js";
import useSensorData from "./hooks/useSensorData.js";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";

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
        // setLastCenter(pos);
        map.setView(pos, mapDefaultProps.zoom, {
          animate: true,
        });
      }
    },
    [map]
  );

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
    "ANL1": "SURESTE",
    "ANL2": "NORESTE",
    "ANL3": "SUROESTE",
    "ANL4": "[SAN Pedro]",
    "ANL5": "NORTE2",
    "ANL6": "GARCIA",
    "ANL7": "NOROESTE",
    "ANL8": "SURESTE3",
    "ANL9": "NORTE",
    "ANL10": "NORESTE2",
    "ANL11": "SUR",
    "ANL12": "CENTRO",
    "ANL13": "SURESTE2",
    "ANL15": "PESQUERIA",
}

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
        humedad: ( typeof data.Humedad_R === 'undefined' || data.Humedad_R === null ) ?  "N/D" : data.Humedad_R.toString(),
        temperatura: ( typeof data.Temperatura_C === 'undefined' || data.Temperatura_C === null ) ?  "N/D" : data.Temperatura_C.toString(),
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
        //url para boton de Mas Informacion
        urlMI:(() => {
          if (data.Sistema === "PurpleAir")
            return "https://map.purpleair.com/1/mAQI/a10/p0/cC0?select="+data.Sensor_id.substr(1)+"#13.91/"+data.Latitud+"/"+data.Longitud;
          if (data.Sistema === "AireNuevoLeon")
            return "http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1="+ANLKeys_dict[data.Sensor_id];
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
        <p>Consulta información en tiempo real sobre la calidad del aire en Monterrey</p>
      </div>
      <div className="mapa-info mt-5 mb-3">
        <p>En esta página puedes ver información en tiempo real acerca de la calidad del aire en Monterrey, si deseas obtener información más específica puedes hacer uso de los filtros de abajo.</p>
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
      <div  style ={{padding:'1%', width: "70%", margin: "0 auto"}}>
        <button class="smallBotton" style ={{color:'dark-grey', radius:'50%'}} onClick={() => setshowHideState(!showHideState)}>{showHideState ? "Leyenda Ocultar" : "Leyenda Mostrar" }</button>
      </div>
      <div
        className="my-4 ta-center map-container"
        style={{
          zIndex: 0,
          position: "relative",
          height: "500px",
          margin: "0 auto"
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
          { showHideState ?                 
            <div className="leyenda-width opt1" >
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
                      <div className="mb-2">
                        Los sensores del estado se representan con un círculo
                      </div>
    
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
                      <div className="mb-2">
                        Los sensores de Purple Air se representan con un cuadrado
                      </div>
    
                      <div className="">ND</div>
                      <div>No dato</div>
                    </div>
                    </div>
              : null
            }
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
              if (currentGas.name === "PM25") {
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
                if (!markerProps.isPurpleAir) {
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
      <Recomendaciones selected={airQualityTags[airQualityIndex]} isManual={false} />
      <TablaCalidad/>
    </div>
  );
}

export default Mapa;
