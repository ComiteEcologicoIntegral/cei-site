import React, { useState, useEffect } from 'react';
import RHFiltros from './components/RHFiltros';
import Grafica from './components/Grafica';
import Calendario from './components/Calendario';
import Heatmap from './components/Heatmap';
import moment from 'moment';
import 'moment/locale/es';
import { apiUrl } from './constants';


moment.locale('es');

function Registro() {
    const [data, setData] = useState(null);
    const [radioValue, setRadioValue] = useState('1');
    const [q, setQ] = useState(null);

    const [indi, setIndi] = useState('PM25');
    const [desde, setDesde] = useState(null);
    const [hasta, setHasta] = useState(null);
    const [ind, setInd] = useState({ value: 'PM25' });
    const [ubic, setUbic] = useState(null);

    useEffect(() => {
        if (q) {
            if (radioValue === '1') {
                const locations = ubic
                    .map((u) => u.label)
                    .reduce(
                        (p, c) =>
                            p === '' ? `locations=${c}` : `${p}&locations=${c}`,
                        ''
                    );

                fetch(`${apiUrl}/get-graph?${locations}&gas=${ind.value}`)
                    .then((response) => response.json())
                    .then((json) => {
                        setData(json);
                    });
            } 
            else {
                fetch(`${apiUrl}/datos-fecha?${q}`)
                    .then((response) => response.json())
                    .then((json) => setData(json));
            }
        }
    }, [q]);

    useEffect(() => {
        setData(null);
    }, [radioValue]);

    function createQueryGraph() {
        // Ejemplo:
        // http://127.0.0.1:8000/datos-fecha?ubic=PA39362&ind=PM25&inicio=2020-10-05&fin=2020-10-06

        if (!ubic) {
            alert('Selecciona una ubicación.');
            return;
        }
        if ((!desde || !hasta)) {
            alert('Selecciona las fechas.');
            return;
        }

        let queryStr = 'ubic=';

        ubic.forEach((element) => {
            queryStr += element.value + ',';
        });

        queryStr = queryStr.slice(0, -1);
        queryStr +=
            '&ind=' +
            ind.value +
            '&inicio=' +
            desde.format('YYYY-MM-DD') +
            '&fin=' +
            hasta.format('YYYY-MM-DD');

        console.log("querystr");
        console.log(queryStr);

        setIndi(ind.value);
        setQ(queryStr);
    }

    function createQueryCal(d, h) {
        // Ejemplo:
        // http://127.0.0.1:8000/datos-fecha?ubic=PA39362&ind=PM25&inicio=2020-10-05&fin=2020-10-06

        if (!ubic) {
            alert('Selecciona una ubicación.');
            return;
        }
        if ((!d || !h)) {
            d = desde;
            h = hasta;
        }

        let queryStr = 'ubic=';

        ubic.forEach((element) => {
            queryStr += element.value + ',';
        });

        queryStr = queryStr.slice(0, -1);
        queryStr +=
            '&ind=' +
            ind.value +
            '&inicio=' +
            d.format('YYYY-MM-DD') +
            '&fin=' +
            h.format('YYYY-MM-DD');

        console.log("querystr: " + queryStr);

        setIndi(ind.value);
        setQ(queryStr);
    }

    function downloadFile() {
        if (q) {
            let queryStr = 'ubic=';
            ubic.forEach((element) => {
                queryStr += element.value + ',';
            });
            queryStr = queryStr.slice(0, -1);

            if (radioValue === '2') {
                // para el calendario se descarga todo el mes
                queryStr +=
                    '&ind=' +
                    ind.value +
                    '&inicio=' +
                    desde.startOf('month').format('YYYY-MM-DD') +
                    '&fin=' +
                    hasta.endOf('month').format('YYYY-MM-DD');
            } else {
                queryStr +=
                    '&ind=' +
                    ind.value +
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
                setInd={setInd}
                setUbic={setUbic}
            />
            {radioValue === '1' && (
                <Grafica setDesde={setDesde} setHasta={setHasta} {...data} />
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
                <Heatmap q={q} fecha={desde} ubic={ubic} ind={indi}/>
                </>
            )}
        </div>
    );
}

export default Registro;
