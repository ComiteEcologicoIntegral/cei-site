import React, {useRef,  useEffect, useState} from 'react'
import ComparaFiltros from './components/ComparaFiltros'
import { Col, Row, Button } from 'react-bootstrap'
import { func } from 'prop-types';
import { AiOutlineZhihu } from 'react-icons/ai';
import { fetchSummaryData } from './handlers/data';
import { useDispatch, useSelector } from 'react-redux';
import { setSensorData } from './redux/reducers';
import moment from 'moment';


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

    if (sensRaw) {
        sensRaw.forEach(element => {
            sensores.push({value: element.Sensor_id, label: element.Zona});
        });
    }

    const data = useRef([]);
    const maxNum = 3;
    const numFiltros = useRef(-1);
    const [filters, setFilters] = useState([]);
    const filterData = useRef([]);

    function modifyData(data, index) {
        filterData.current[index] = data;
    }

    function addFiltro() {
        if (numFiltros.current < maxNum) {
            numFiltros.current = numFiltros.current + 1;
            setFilters([...filters, <ComparaFiltros id={numFiltros.current} modifyData={modifyData} sensores={sensores}/>]);
        }
    }

    function queryData() {
        console.log(filterData.current);
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
                <Col sm={4} className="d-flex justify-content-between">
                    <Button onClick={() => addFiltro()}>Agregar un filtro</Button>
                    <Button onClick={() => queryData()}>Generar gráfica</Button>
                </Col>
            </Row>
            <Row>
            <Col sm={12}>
                <div class="grafico">

                </div>
            </Col>
            </Row>
        </div>
    )
}

export default Compara
