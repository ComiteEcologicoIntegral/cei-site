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
    const [radioValue, setRadioValue] = useState('1'); // sección seleccionada (Gráfica/Calendario)
    const [q, setQ] = useState(null); // string del query

    const [loading, setLoading] = useState(false); // gif

    // Datos de los filtros:
    //const [indi, setIndi] = useState('PM25');
    const [desde, setDesde] = useState(null);
    const [hasta, setHasta] = useState(null);
    const ind = useRef({ value: 'PM25' });
    const ubic = useRef(null);

    useEffect(() => {
        if (q) {
            if (radioValue === '1') { // Sección gráfica
                fetch(`${apiUrl}/get-graph?${q}`)
                    .then((response) => response.json())
                    .then((json) => {
                        setData(json.plot);
                        setSummaryData(json.summary);
                        setLoading(false);
                    });
            } else { // Sección calendario
                fetch(`${apiUrl}/datos-fecha?${q}`)
                    .then((response) => response.json())
                    .then((json) => setData(json));
            }
        }
    }, [q]); // Cada que cambia el string del query creado, hacemos un request al api

    useEffect(() => {
        setData(null);
    }, [radioValue]); // Cuando cambiamos entre Gráfica y Calendario, borramos los datos

    // Esta función es llamada por un componente hijo para actualizar los valores cada que cambian en los filtros
    function updateMainFiltros(u, i) {
        ubic.current = u;
        ind.current = i;
    }

    // Crea el string del query para la gráfica
    function createQueryGraph() {
        if (!ubic) {
            alert('Selecciona una ubicación.');
            return;
        }
        if (!desde || !hasta) {
            alert('Selecciona las fechas.');
            return;
        }

        setLoading(true); // Muestra gif de loading

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

        console.log(queryStr);

        //setIndi(ind.current.value);
        setQ(queryStr);
    }

    // Crea el string del query para el calendario
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

        console.log(queryStr);

        //setIndi(ind.current.value);
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
                // Para el calendario se descarga todo el mes
                queryStr +=
                    '&ind=' +
                    ind.current.value +
                    '&inicio=' +
                    desde.startOf('month').format('YYYY-MM-DD') +
                    '&fin=' +
                    hasta.endOf('month').format('YYYY-MM-DD');
            } else {
                // Para la sección de la gráfica se descarga según las fechas seleccionadas
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
                        indi={ind.current.value}
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
