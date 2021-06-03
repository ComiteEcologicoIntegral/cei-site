import React, { useState, useEffect, useRef } from 'react';
import RHFiltros from './components/RHFiltros';
import Grafica from './components/Grafica';
import Calendario from './components/Calendario';
import HeatMap from './components/HeatMap';
import moment from 'moment';
import 'moment/locale/es';
import { apiUrl } from './constants';

moment.locale('es');

function Registro() {
    const [data, setData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);
    const [radioValue, setRadioValue] = useState('1');
    const [q, setQ] = useState(null);

    const [loading, setLoading] = useState(false);

    // Datos de los filtros:
    const [indi, setIndi] = useState('PM25');
    const [desde, setDesde] = useState(null);
    const [hasta, setHasta] = useState(null);
    const ind = useRef({ value: 'PM25' });
    const ubic = useRef(null);

    useEffect(() => {
        if (q) {
            if (radioValue === '1') {
                fetch(`${apiUrl}/get-graph?${q}`)
                    .then((response) => response.json())
                    .then((json) => {
                        setData(json.plot);
                        setSummaryData(json.summary);
                        setLoading(false);
                    });
            } else {
                fetch(`${apiUrl}/datos-fecha?${q}`)
                    .then((response) => response.json())
                    .then((json) => setData(json));
            }
        }
    }, [q]);

    useEffect(() => {
        setData(null);
    }, [radioValue]);

    function updateMainFiltros(u, i) {
        console.log(loading);
        ubic.current = u;
        ind.current = i;
    }

    function createQueryGraph() {
        if (!ubic) {
            alert('Selecciona una ubicación.');
            return;
        }
        if (!desde || !hasta) {
            alert('Selecciona las fechas.');
            return;
        }

        setLoading(true);

        const locations = ubic.current
            .map((u) => u.label)
            .reduce(
                (p, c) => (p === '' ? `locations=${c}` : `${p}&locations=${c}`),
                ''
            );

        let queryStr = `${locations}&gas=${
            ind.current.value
        }&start_date=${moment.utc(desde).format('MM/DD/YYYY')}&end_date=${moment
            .utc(hasta)
            .format('MM/DD/YYYY')}`;

        console.log('querystr');
        console.log(queryStr);

        setIndi(ind.current.value);
        setQ(queryStr);
    }

    function createQueryCal(d, h) {
        // Ejemplo:
        // http://127.0.0.1:8000/datos-fecha?ubic=PA39362&ind=PM25&inicio=2020-10-05&fin=2020-10-06

        if (!ubic.current) {
            alert('Selecciona una ubicación.');
            return;
        }

        if (!d || !h) {
            d = desde;
            h = hasta;
        }

        let queryStr = 'ubic=';

        ubic.current.forEach((element) => {
            queryStr += element.value + ',';
        });

        queryStr = queryStr.slice(0, -1);
        queryStr +=
            '&ind=' +
            ind.current.value +
            '&inicio=' +
            d.format('YYYY-MM-DD') +
            '&fin=' +
            h.format('YYYY-MM-DD');

        console.log('querystr: ' + queryStr);

        setIndi(ind.current.value);
        setQ(queryStr);
    }

    function downloadFile() {
        if (q) {
            let queryStr = 'ubic=';
            ubic.current.forEach((element) => {
                queryStr += element.value + ',';
            });
            queryStr = queryStr.slice(0, -1);

            if (radioValue === '2') {
                // para el calendario se descarga todo el mes
                queryStr +=
                    '&ind=' +
                    ind.current.value +
                    '&inicio=' +
                    desde.startOf('month').format('YYYY-MM-DD') +
                    '&fin=' +
                    hasta.endOf('month').format('YYYY-MM-DD');
            } else {
                queryStr +=
                    '&ind=' +
                    ind.current.value +
                    '&inicio=' +
                    desde.format('YYYY-MM-DD') +
                    '&fin=' +
                    hasta.format('YYYY-MM-DD');
            }

            fetch(`${apiUrl}/download-data?${queryStr}`)
                .then((response) => response.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'data.csv';

                    const clickHandler = () => {
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                            a.removeEventListener('click', clickHandler);
                        }, 150);
                    };

                    a.addEventListener('click', clickHandler, false);
                    a.click();
                });
        }
    }

    return (
        <div className="container mb-10">
            <RHFiltros
                createQueryGraph={createQueryGraph}
                createQueryCal={createQueryCal}
                radioValue={radioValue}
                setRadioValue={setRadioValue}
                updateMainFiltros={updateMainFiltros}
            />
            {radioValue === '1' && (
                <Grafica
                    setDesde={setDesde}
                    setHasta={setHasta}
                    downloadFile={downloadFile}
                    summary={summaryData}
                    {...data}
                />
            )}
            {radioValue === '2' && (
                <>
                    <Calendario
                        q={q}
                        create={createQueryCal}
                        data={data}
                        indi={indi}
                        setDesde={setDesde}
                        setHasta={setHasta}
                        downloadFile={downloadFile}
                    />
                    <HeatMap
                        q={q}
                        fecha={desde}
                        ubic={ubic.current}
                        ind={ind.current.value}
                    />
                </>
            )}
            <div>
                <img
                    src="loading.gif"
                    alt="Cargando..."
                    className="loading"
                    style={loading ? {} : { display: 'none' }}
                />
            </div>
        </div>
    );
}

export default Registro;
