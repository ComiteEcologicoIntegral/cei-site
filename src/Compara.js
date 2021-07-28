import React, {useRef,  useEffect, useState} from 'react'
import ComparaFiltros from './components/ComparaFiltros'
import { Col, Row, Button } from 'react-bootstrap'
import { fetchSummaryData } from './handlers/data';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorData } from './redux/reducers';
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
        if (numFiltros.current != -1) {
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

        for (let i=0; i<=numFiltros.current ; i++) {
            if (!filterData.current[i]|| !filterData.current[i]["desde"] || !filterData.current[i]["hasta"]) { // A alguno le falta seleccionar fechas
                alert("Selecciona las fechas");
                return;
            } else {
                // Unir con comas
                ubicaciones += filterData.current[i]["ubic"].value + ",";
                gases += filterData.current[i]["ind"] + ",";
                fechas_inicio += filterData.current[i]["desde"] + ",";
                fechas_fin += filterData.current[i]["hasta"] + ",";
            }
        }

        // Quitar última coma
        ubicaciones = ubicaciones.slice(0, -1);
        gases = gases.slice(0, -1);
        fechas_inicio = fechas_inicio.slice(0, -1);
        fechas_fin = fechas_fin.slice(0, -1);

        let query = `ubic=${ubicaciones}&ind=${gases}&inicio=${fechas_inicio}&fin=${fechas_fin}`;

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

    let graphLayout = {
        title: 'Compara datos',
        hovermode: 'closest',
        width: 1000,
        height: 500
    };

    const [graphData, setGraphData] = useState([]);

    let colors = ['red', 'green', 'blue', 'orange']; // Opciones de color de las líneas

    function createGraph() {
        let graph = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let ubicacion = sensores.find(sensor => sensor.sensor_id === filterData.current[i]["ubic"].value).label;
                let gas = filterData.current[i]["ind"] == "PM25" ? "PM2.5" : filterData.current[i]["ind"];

                data[i].name = `${ubicacion} (${gas})`; 
                data[i].type = "scatter";
                data[i].mode = "lines+markers";
                data[i].marker = { color: colors[i] };
                
                data[i].text = data[i].dia.map(function(d) { return moment.utc(new Date(d)).local() } );

                data[i].hovertemplate = '<i>Medida</i>: %{y:.4f}' +'<br><b>%{text}</b>'; // Tooltip

                graph.push(data[i]);
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
                <div class="grafico mt-5">
                    <Plot
                        data={graphData}
                        layout={graphLayout}
                    />
                </div>
            </Col>
            </Row>
        </div>
    )
}

export default Compara
