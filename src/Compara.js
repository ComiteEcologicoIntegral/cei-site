import React, { useRef, useEffect, useState } from "react";
import ComparaFiltros from "./components/ComparaFiltros";
import { Col, Row, Button } from "react-bootstrap";
import { fetchSummaryData } from "./handlers/data";
import { useDispatch, useSelector } from "react-redux";
import { setSensorData } from "./redux/reducers";
import moment from "moment";
import "moment/locale/es";
import { apiUrl, criteria } from "./constants";
import Plot from "react-plotly.js";

function Compara() {
  const dispatch = useDispatch();
  const { sensorDataLastUpdate, sensorData } = useSelector((state) => state);
  const [sensRaw, setSensRaw] = useState(null);
  let sensores = [];

  useEffect(() => {
    const diff = sensorDataLastUpdate
      ? moment().diff(sensorDataLastUpdate, "minutes")
      : 999;

    if (diff > 60) {
      fetchSummaryData()
        .then((data) => {
          dispatch(setSensorData(data));
          setSensRaw(data);
        })
        .catch((err) => console.error(err));
    } else {
      setSensRaw(sensorData);
    }
  }, [sensorDataLastUpdate, dispatch, sensorData]);

  // Crear valores para mandar al componente ComparaFiltros:
  if (sensRaw) {
    sensRaw.forEach((element) => {
      sensores.push({
        sensor_id: element.Sensor_id,
        zona: element.Zona,
        sistema: element.Sistema,
      });
    });
  }

  const maxNum = 3;
  const numFiltros = useRef(-1);
  const [filters, setFilters] = useState([]);
  const filterData = useRef([]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  function modifyMinFecha(clear) {
    let tempFecha = moment(
      filterData.current[0]["desde"] + " " + filterData.current[0]["desdeHora"],
    );
    let tempDay = (3 + tempFecha.isoWeekday()).toString();
    if (tempFecha.isoWeekday() != 7) {
      tempDay = "0" + tempDay;
    }

    for (let i = 1; i <= numFiltros.current; i++) {
      let minFecha = "2010-01-04".slice(0, -2) + tempDay;
      var filtro = document.getElementById("filtro-" + i + "desde");
      if (filtro != null) {
        filtro.min = minFecha;
        const today = moment().format("YYYY-MM-DD");
        if (clear === 1) {
          filtro.value = null;
        } else if (clear === 2) {
          filtro.type = "month";
          minFecha = "2018-01";
          filtro.id = "filtro-" + i + "desde";
          const today2 = moment().format("YYYY-MM");
          filtro.step = "1";
          filtro.min = minFecha;
          filtro.max = today2;
          filtro.onChange = (event) => {
            filterData.current[0]["desde"] = event.target.value;
            filterData.current[0].updateData();
          };
        } else if (clear === 3) {
          filtro.min = minFecha;
          const today = moment().format("YYYY-MM-DD");
          filtro.type = "date";
          filtro.step = "7";
          filtro.min = minFecha;
          filtro.max = today;
          filtro.onChange = (event) => {
            filterData.current[0]["desde"] = event.target.value;
            filterData.current[0].updateData();
          };
          filtro.id = "filtro-" + i + "desde";
        } else if (clear === 4) {
          filtro.type = "date";
          filtro.step = "1";
          filtro.min = minFecha;
          filtro.max = today;
          filtro.onChange = (event) => {
            filterData.current[0]["desde"] = event.target.value;
            filterData.current[0].updateData();
          };
          filtro.id = "filtro-" + i + "desde";
        }
      }
    }
  }

  // Esta función es llamada por los cada componente hijo (CompraFiltros) cuando se modifican los valores seleccionados
  // Todos los valores de los filtros se guardan en un solo arreglo
  function modifyData(data, index) {
    filterData.current[index] = data;
    var filtro = document.getElementById("filtro-" + index + "desde");
    if (
      filterData.current[0]["hasta"] != null &&
      filterData.current[0]["desde"] != null
    ) {
      if (filtro != null) {
        if (filtro.type !== "date") {
          var filtroDay = moment(filterData.current[0]["desde"]).date();
          var strDia = "";
          if (filtroDay < 10) {
            strDia = "0" + filtroDay.toString();
          } else {
            strDia = filtroDay.toString();
          }
          filterData.current[index]["desde"] =
            filterData.current[index]["desde"] + "-" + strDia;
        }
      }
      var fecha2 = moment(
        filterData.current[0]["hasta"] +
          " " +
          filterData.current[0]["hastaHora"],
      );
      var fecha1 = moment(
        filterData.current[0]["desde"] +
          " " +
          filterData.current[0]["desdeHora"],
      );
      var dias = fecha2.diff(fecha1, "days");
      fecha1.add(dias, "days");
      var mins = fecha2.diff(fecha1, "minutes");

      //Checar si el limite es dia de la semana, dia del mes o solamente hora
      //Dias minimos para pasar de filtro de hora a filtro de semana
      var diasMinSem = 1;
      //Dias maximos para pasar de filtro de semana a filtro de mes
      var diasMaxSem = 10;
      if (dias > diasMinSem && dias <= diasMaxSem) {
        //Filtrar por dia de la semana
        modifyMinFecha(3);
      } else if (dias > diasMaxSem) {
        //Filtrar por dia del mes
        modifyMinFecha(2);
      } else {
        //filtar por hora
        modifyMinFecha(4);
      }

      for (let i = 1; i <= numFiltros.current; i++) {
        let tempFecha = moment(
          filterData.current[i]["desde"] +
            " " +
            filterData.current[0]["desdeHora"],
        );
        //alert(tempFecha)
        tempFecha.add(dias, "days");
        tempFecha.add(mins, "minutes");
        //alert(tempFecha)
        filterData.current[i]["hasta"] = tempFecha.format("YYYY-MM-DD");
        filterData.current[i]["hastaHora"] = tempFecha.format("HH:mm:ss");
        filterData.current[i]["desdeHora"] = filterData.current[0]["desdeHora"];
      }
      if (index === 0) {
        modifyMinFecha(1);
      }
    }
  }

  function addFiltro() {
    if (numFiltros.current < 0) {
      numFiltros.current = numFiltros.current + 1;
      setFilters([
        ...filters,
        <ComparaFiltros
          id={numFiltros.current}
          modifyData={modifyData}
          sensores={sensores}
        />,
      ]);
    } else if (
      numFiltros.current < maxNum &&
      filterData.current[0]["desde"] != null &&
      filterData.current[0]["hasta"] != null
    ) {
      numFiltros.current = numFiltros.current + 1;
      setFilters([
        ...filters,
        <ComparaFiltros
          id={numFiltros.current}
          modifyData={modifyData}
          sensores={sensores}
        />,
      ]);
      modifyMinFecha(0);
    } else if (numFiltros.current < maxNum) {
      alert("Primero debe llenar el campo de fechas en el primer filtro");
    } else {
      alert("Ya tiene el maximo de 4 filtros");
    }
  }

  // Elimina el último filtro
  function deleteFiltro() {
    if (numFiltros.current !== -1) {
      let filtroDiv = document.getElementById(
        `filtro-${numFiltros.current}`,
      ).parentNode;
      filtroDiv.parentNode.removeChild(filtroDiv);
      numFiltros.current = numFiltros.current - 1;
    }
  }

  function queryData() {
    if (numFiltros.current < 0) {
      return;
    }
    let ubicaciones = "";
    let gases = "";
    let fechas_inicio = "";
    let fechas_fin = "";
    let sensors_id = "";

    for (let i = 0; i <= numFiltros.current; i++) {
      if (
        !filterData.current[i] ||
        !filterData.current[i]["desde"] ||
        !filterData.current[i]["hasta"]
      ) {
        // A alguno le falta seleccionar fechas
        alert(
          filterData.current[0]["desde"] +
            "/" +
            filterData.current[0]["desdeHora"] +
            ",",
        );
        return;
      } else if (!filterData.current[i]["ubic"]) {
        alert("Seleccione la ubicacion");
        return;
      } else {
        // Unir con comas
        ubicaciones += filterData.current[i]["ubic"].label + ",";
        gases += filterData.current[i]["ind"] + ",";
        fechas_inicio +=
          filterData.current[i]["desde"] +
          "/" +
          filterData.current[i]["desdeHora"] +
          ",";
        fechas_fin +=
          filterData.current[i]["hasta"] +
          "/" +
          filterData.current[i]["hastaHora"] +
          ",";
        sensors_id += filterData.current[i]["ubic"].value + ",";
      }
    }

    // Quitar última coma
    ubicaciones = ubicaciones.slice(0, -1);
    gases = gases.slice(0, -1);
    fechas_inicio = fechas_inicio.slice(0, -1);
    fechas_fin = fechas_fin.slice(0, -1);
    sensors_id = sensors_id.slice(0, -1);

    let query = `ubic=${ubicaciones}&ind=${gases}&inicio=${fechas_inicio}&fin=${fechas_fin}&sensors_id=${sensors_id}`;

    setLoading(true); // Muestra gif de loading

    fetch(`${apiUrl}/compare?${query}`)
      .then((response) => response.json())
      .then((json) => {
        setLoading(false);
        setData(json);
      });
  }

  useEffect(() => {
    createGraph();
  }, [data]);

  const [limiteOMS, setLimiteOMS] = useState(null);

  let graphLayout = {
    title: {
      text: "Compara datos",
      font: {
        size: 24,
      },
    },
    font: {
      size: 16,
    },
    showlegend: true,
    hovermode: "closest",
    width: 1000,
    height: 700,
    xaxis: {
      title: "Fechas",
      type: "-",
    },
  };

  let getAnnotations = () => [
    {
      xref: "paper",
      x: 1.01,
      y: limiteOMS,
      xanchor: "left",
      yanchor: "middle",
      text: "Límite recomendado <br>por la OMS 24h",
      showarrow: false,
      font: {
        family: "Arial",
        size: 12,
        color: "white",
      },
      bgcolor: "#4682b4",
    },
  ];

  let getShapes = () => {
    let limits;
    if (gas) {
      limits = criteria["semarnat"][gas.replace(/[.]/g, "")]; // We remove dots to normalize the gas name
    } else {
      limits = criteria["semarnat"]["PM25"];
    }

    let shapes = [
      // Nivel 1
      {
        type: "rect",
        xref: "paper",
        x0: 0,
        y0: 0,
        x1: 1,
        y1: limits[0],
        fillcolor: "rgb(0, 228, 0)",
        opacity: 0.3,
        line: {
          width: 0,
        },
      },
      // Nivel 2
      {
        type: "rect",
        xref: "paper",
        x0: 0,
        y0: limits[0],
        x1: 1,
        y1: limits[1],
        fillcolor: "rgb(255, 255, 0)",
        opacity: 0.3,
        line: {
          width: 0,
        },
      },
      // Nivel 3
      {
        type: "rect",
        xref: "paper",
        x0: 0,
        y0: limits[1],
        x1: 1,
        y1: limits[2],
        fillcolor: "rgb(255, 126, 0)",
        opacity: 0.3,
        line: {
          width: 0,
        },
      },
      // Nivel 4
      {
        type: "rect",
        xref: "paper",
        x0: 0,
        y0: limits[2],
        x1: 1,
        y1: limits[3],
        fillcolor: "rgb(255, 0, 0)",
        opacity: 0.3,
        line: {
          width: 0,
        },
      },
      // Nivel 5
      {
        type: "rect",
        xref: "paper",
        x0: 0,
        y0: limits[3],
        x1: 1,
        y1: limits[3] * 1.2,
        fillcolor: "rgb(143, 63, 151)",
        opacity: 0.3,
        line: {
          width: 0,
        },
      },
      {
        type: "line",
        xref: "paper",
        x0: 0,
        y0: limiteOMS,
        x1: 1,
        y1: limiteOMS,
        line: {
          color: "#4682b4",
          width: 2,
          dash: "dash",
        },
      },
    ];

    return shapes;
  };

  const [graphData, setGraphData] = useState([]);
  const [gas, setGas] = useState(null);

  let colors = ["red", "green", "blue", "orange"]; // Opciones de color de las líneas
  let colors2 = ["purple", "pink", "black", "cyan"]; // Opciones de color de las líneas
  let colors3 = ["orange", "brown", "grey", "maroon"]; // Opciones de color de las líneas

  function createGraph() {
    let graph = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        let ubicacion = sensores.find(
          (sensor) => sensor.sensor_id === filterData.current[i]["ubic"].value,
        ).zona;
        let gas =
          filterData.current[i]["ind"] === "PM25"
            ? "PM2.5"
            : filterData.current[i]["ind"];
        setGas(gas);

        const oms_limits = criteria["oms"];

        setLimiteOMS(oms_limits[gas.replace(/[.]/g, "")]);

        data[i].name = `${ubicacion} (${gas})`;
        data[i].type = "scatter";
        data[i].mode = "lines";
        data[i].marker = { color: colors[i] };

        data[i].text = data[i].dia.map(function (d) {
          return moment.utc(new Date(d)).format("DD-MM-YYYY HH:mm:ss");
        });

        data[i].hovertemplate =
          "<i>Medida</i>: %{y:.4f}" + "<br><b>%{text}</b>"; // Tooltip

        graph.push(data[i]);

        if (gas === "PM2.5" || gas === "PM10") {
          // Agregar promedio movil 24h
          const dataPromMovil = { ...data[i] };
          dataPromMovil.name = `${ubicacion} (${gas}) Promedio movil 24h`;
          dataPromMovil.marker = { color: colors2[i] };
          dataPromMovil.y = dataPromMovil.moving_average;
          dataPromMovil.visible = "legendonly";
          graph.push(dataPromMovil);

          // Agregar Indice aire y salud
          const dataICAR = { ...data[i] };
          dataICAR.name = `${ubicacion} (${gas}) Indice Aire y Salud`;
          dataICAR.marker = { color: colors3[i] };
          dataICAR.y = dataICAR.ICAR;
          dataICAR.visible = "legendonly";
          graph.push(dataICAR);
        } else if (gas === "SO2") {
          // Agregar promedio movil 24h
          const dataPromMovil = { ...data[i] };
          dataPromMovil.name = `${ubicacion} (${gas}) Promedio movil 24h`;
          dataPromMovil.marker = { color: colors2[i] };
          dataPromMovil.y = dataPromMovil.moving_average;
          dataPromMovil.visible = "legendonly";
          graph.push(dataPromMovil);
        } else if (gas === "CO") {
          // Agregar promedio movil 8h
          const dataPromMovil = { ...data[i] };
          dataPromMovil.name = `${ubicacion} (${gas}) Promedio movil 8h`;
          dataPromMovil.marker = { color: colors2[i] };
          dataPromMovil.y = dataPromMovil.moving_average;
          dataPromMovil.visible = "legendonly";
          graph.push(dataPromMovil);
        }
      }

      setGraphData(graph);
    }
  }

  return (
    <div className="container mt-5">
      <div className="ta-center mb-5">
        <h2>Compara datos</h2>
        <p>Compara la calidad del aire en diferente lugar y tiempo</p>
      </div>
      <hr className="mb-4" />
      <div>
        <p>Pasos para generar las gráficas:</p>
        <ol>
          <li>
            Agerga el primer filtro que deseas graficar seleccionando el
            sistema, la ubicación, el contaminante, la fecha de inicio y la
            fecha final.
          </li>
          <li>
            Agerga otro filtro seleccionando las opciones que deseas comparar.
          </li>
          <li>Repite el segundo paso hasta 4 veces si así lo deseas.</li>
          <li>Persiona el botón "Generar gráfica".</li>
        </ol>
      </div>
      <Row className="mt-2 mb-1 d-flex justify-content-center" id="filtros">
        {filters}
      </Row>
      <Row className="d-flex justify-content-end">
        <Col sm={6} className="d-flex justify-content-between">
          <Button onClick={() => addFiltro()}>Agregar un filtro</Button>
          <Button onClick={() => deleteFiltro()}>Eliminar un filtro</Button>
          <Button onClick={() => queryData()}>Generar gráfica</Button>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <div className="text-center">
            <img
              src="loading.gif"
              alt="Cargando..."
              className="loading"
              style={loading ? {} : { display: "none" }}
            />
          </div>
          <div class="grafico-compara mt-5">
            <Plot
              data={graphData}
              layout={
                data
                  ? {
                      ...graphLayout,
                      shapes: getShapes(),
                      annotations: getAnnotations(),
                    }
                  : { ...graphLayout }
              }
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Compara;
