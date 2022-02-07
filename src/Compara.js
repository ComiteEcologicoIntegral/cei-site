import React, {useRef,  useEffect, useState} from 'react'
import ComparaFiltros from './components/ComparaFiltros'
import { Col, Row, Button } from 'react-bootstrap'
import { fetchSummaryData } from './handlers/data';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorData } from './redux/reducers';
import Recomendaciones from './components/Recomendaciones';
import moment from 'moment';
import 'moment/locale/es';
import { apiUrl } from './constants';
import Plot from 'react-plotly.js';

function Compara() {

    const dispatch = useDispatch();
    const { sensorDataLastUpdate, sensorData } = useSelector((state) => state);
    const [sensRaw, setSensRaw] = useState(null);
    let sensores = [];

    useEffect(() => {
        const diff = sensorDataLastUpdate
            ? moment().diff(sensorDataLastUpdate, 'minutes')
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
    }, []);

    // Crear valores para mandar al componente ComparaFiltros:
    if (sensRaw) {
        sensRaw.forEach(element => {
            sensores.push({sensor_id: element.Sensor_id, zona: element.Zona, sistema: element.Sistema});
        });
    }

    const maxNum = 3;
    const numFiltros = useRef(-1);
    const [filters, setFilters] = useState([]);
    const filterData = useRef([]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);


    // Esta función es llamada por los cada componente hijo (CompraFiltros) cuando se modifican los valores seleccionados
    // Todos los valores de los filtros se guardan en un solo arreglo 
    function modifyData(data, index) {
        filterData.current[index] = data;
    }

    function addFiltro() {
        if (numFiltros.current < maxNum) {
            numFiltros.current = numFiltros.current + 1;
            setFilters([...filters, <ComparaFiltros id={numFiltros.current} modifyData={modifyData} sensores={sensores}/>]);
        }
    }

    // Elimina el último filtro
    function deleteFiltro() {
        if (numFiltros.current !== -1) {
            let filtroDiv = document.getElementById(`filtro-${numFiltros.current}`).parentNode;
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

        for (let i=0; i<=numFiltros.current ; i++) {
            if (!filterData.current[i]|| !filterData.current[i]["desde"] || !filterData.current[i]["hasta"]) { // A alguno le falta seleccionar fechas
                alert("Selecciona las fechas");
                return;
            } else {
                // Unir con comas
                ubicaciones += filterData.current[i]["ubic"].label + ",";
                gases += filterData.current[i]["ind"] + ",";
                fechas_inicio += filterData.current[i]["desde"] + "/" + filterData.current[i]["desdeHora"] + ",";
                fechas_fin += filterData.current[i]["hasta"] + "/" + filterData.current[i]["hastaHora"] + ",";
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
                setData(json)
            });

    }

    useEffect(() => {
        createGraph();
    }, [data])

    const [limiteOMS, setLimiteOMS] = useState(null);

    let graphLayout = {
        title: {
            text: 'Compara datos',
            font: {
                size: 24
            }
        },
        font: {
            size: 16
        },
        showlegend: true,
        hovermode: 'closest',
        width: 1000,
        height: 700
    };

    let getAnnotations = () => [
        {
            xref: 'paper',
            x: 1.01,
            y: (limiteOMS),
            xanchor: 'left',
            yanchor: 'middle',
            text: 'Límite recomendado <br>por la OMS 24h',
            showarrow: false,
            font: {
                family: 'Arial',
                size: 12,
                color: 'white'
            },
            bgcolor: '#4682b4',
        }
    ];

    let getShapes = () => {
        let min1, max1, min2, max2, min3, max3, min4, max4, min5, max5;

        switch(gas) {
            case 'PM2.5':
                min1 = 0;
                max1 = 25;
                min2 = 25;
                max2 = 45;
                min3 = 45;
                max3 = 79;
                min4 = 79;
                max4 = 147;
                min5 = 147;
                max5 = 172;
                break;
            case 'PM10':
                min1 = 0;
                max1 = 50;
                min2 = 50;
                max2 = 75;
                min3 = 75;
                max3 = 155;
                min4 = 155;
                max4 = 235;
                min5 = 235;
                max5 = 255;
                break;
            case 'O3':
                min1 = 0;
                max1 = 0.051;
                min2 = 0.051;
                max2 = 0.070;
                min3 = 0.070;
                max3 = 0.092;
                min4 = 0.092;
                max4 = 0.114;
                min5 = 0.114;
                max5 = 0.139;
                break;
            case 'CO':
                min1 = 0;
                max1 = 8.75;
                min2 = 8.75;
                max2 = 11;
                min3 = 11;
                max3 = 13.3;
                min4 = 13.3;
                max4 = 15.5;
                min5 = 15.5;
                max5 = 17.5;
                break;
            case 'NO2':
                min1 = 0;
                max1 = 0.107;
                min2 = 0.107;
                max2 = 0.210;
                min3 = 0.210;
                max3 = 0.230;
                min4 = 0.230;
                max4 = 0.250;
                min5 = 0.250;
                max5 = 0.275;
                break;
            case 'SO2':
                min1 = 0;
                max1 = 0.008;
                min2 = 0.008;
                max2 = 0.110;
                min3 = 0.110;
                max3 = 0.165;
                min4 = 0.165;
                max4 = 0.220;
                min5 = 0.220;
                max5 = 0.255;
                break;
            default:
                min1 = 0;
                max1 = 25;
                min2 = 25;
                max2 = 45;
                min3 = 45;
                max3 = 79;
                min4 = 79;
                max4 = 147;
                min5 = 147;
                max5 = 172;
                break;
        }

        let shapes = [
            // Nivel 1
            {
                type: 'rect',
                xref: 'paper',
                x0: 0,
                y0: min1,
                x1: 1,
                y1: max1,
                fillcolor: 'rgb(0, 228, 0)',
                opacity: 0.3,
                line: {
                    width: 0
                }
            }, 
            // Nivel 2
            {
                type: 'rect',
                xref: 'paper',
                x0: 0,
                y0: min2,
                x1: 1,
                y1: max2,
                fillcolor: 'rgb(255, 255, 0)',
                opacity: 0.3,
                line: {
                    width: 0
                }
            }, 
            // Nivel 3
            {
                type: 'rect',
                xref: 'paper',
                x0: 0,
                y0: min3,
                x1: 1,
                y1: max3,
                fillcolor: 'rgb(255, 126, 0)',
                opacity: 0.3,
                line: {
                    width: 0
                }
            }, 
            // Nivel 4
            {
                type: 'rect',
                xref: 'paper',
                x0: 0,
                y0: min4,
                x1: 1,
                y1: max4,
                fillcolor: 'rgb(255, 0, 0)',
                opacity: 0.3,
                line: {
                    width: 0
                }
            }, 
            // Nivel 5
            {
                type: 'rect',
                xref: 'paper',
                x0: 0,
                y0: min5,
                x1: 1,
                y1: max5,
                fillcolor: 'rgb(143, 63, 151)',
                opacity: 0.3,
                line: {
                    width: 0
                }
            },
            {
                type: 'line',
                xref: 'paper',
                x0: 0,
                y0: limiteOMS,
                x1: 1,
                y1: limiteOMS,
                line:{
                    color: '#4682b4',
                    width: 2,
                    dash:'dash'
                }
            } 
        ];
        
        return shapes
    }


    const [graphData, setGraphData] = useState([]);
    const [gas, setGas] = useState(null);

    let colors = ['red', 'green', 'blue', 'orange']; // Opciones de color de las líneas
    let colors2 = ['purple', 'pink', 'black', 'cyan']; // Opciones de color de las líneas
    let colors3 = ['orange', 'brown', 'grey', 'maroon']; // Opciones de color de las líneas

    function createGraph() {
        let graph = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let ubicacion = sensores.find(sensor => sensor.sensor_id === filterData.current[i]["ubic"].value).zona;
                let gas = filterData.current[i]["ind"] === "PM25" ? "PM2.5" : filterData.current[i]["ind"];
                setGas(gas);

                switch(gas) {
                    case 'PM2.5':
                        setLimiteOMS(15);
                        break;
                    case 'PM10':
                        setLimiteOMS(45);
                        break;
                    case 'O3':
                        setLimiteOMS(0.051);
                        break;
                    case 'NO2':
                        setLimiteOMS(0.013);
                        break;
                    case 'SO2':
                        setLimiteOMS(0.015);
                        break;
                    default:
                        setLimiteOMS(null);
                        break;
                }

                data[i].name = `${ubicacion} (${gas})`; 
                data[i].type = "scatter";
                data[i].mode = "lines";
                data[i].marker = { color: colors[i] };
                
                data[i].text = data[i].dia.map(function(d) { return moment.utc(new Date(d)).format('DD-MM-YYYY HH:mm:ss') } );

                data[i].hovertemplate = '<i>Medida</i>: %{y:.4f}' +'<br><b>%{text}</b>'; // Tooltip

                graph.push(data[i]);

                if(gas === 'PM2.5' || gas === 'PM10') {
                    // Agregar promedio movil 24h
                    const dataPromMovil = { ...data[i] }
                    dataPromMovil.name = `${ubicacion} (${gas}) Promedio movil 24h`
                    dataPromMovil.marker = { color: colors2[i] }
                    // for(let i=0;i<23;i++) {
                    //     moving_average.unshift(null)
                    // }
                    dataPromMovil.y = dataPromMovil.moving_average;
                    graph.push(dataPromMovil)
                    
                    // Agregar Indice aire y salud
                    const dataICAR = { ...data[i] }
                    dataICAR.name = `${ubicacion} (${gas}) Indice Aire y Salud`
                    dataICAR.marker = { color: colors3[i] }
                    // for(let i=0;i<23;i++) {
                    //     moving_average.unshift(null)
                    // }
                    dataICAR.y = dataICAR.ICAR;
                    graph.push(dataICAR)

                } else if (gas === 'SO2') {
                    // Agregar promedio movil 24h
                    const dataPromMovil = { ...data[i] }
                    dataPromMovil.name = `${ubicacion} (${gas}) Promedio movil 24h`
                    dataPromMovil.marker = { color: colors2[i] }
                    // for(let i=0;i<23;i++) {
                    //     moving_average.unshift(null)
                    // }
                    dataPromMovil.y = dataPromMovil.moving_average;
                    graph.push(dataPromMovil)
                    
                } else if (gas === 'CO') {
                    // Agregar promedio movil 8h
                    const dataPromMovil = { ...data[i] }
                    dataPromMovil.name = `${ubicacion} (${gas}) Promedio movil 8h`
                    dataPromMovil.marker = { color: colors2[i] }
                    // for(let i=0;i<7;i++) {
                    //     moving_average.unshift(null)
                    // }
                    dataPromMovil.y = dataPromMovil.moving_average;
                    graph.push(dataPromMovil)
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
            <hr className="mb-4"/>
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
                        style={loading ? {} : { display: 'none' }}
                    />
                </div>
                <div class="grafico-compara mt-5">
                    <Plot
                        data={graphData}
                        layout={ data ? {...graphLayout, shapes: getShapes(), annotations: getAnnotations()} : {...graphLayout}}
                    />
                </div>
            </Col>
            <Recomendaciones isManual={true} />
            </Row>
        </div>
    )
}

export default Compara
