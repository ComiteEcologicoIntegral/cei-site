import React, { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
import { apiUrl } from '../constants';
import { criteria } from '../handlers/statusCriteria';
import { unidad } from '../constants';

// Componente para la página Registro Histórico, sección del calendario
function HeatMap({ q, fecha, ubic, ind }) {
    /* 
        Parámetros:
            - q : query que proviene de RHFiltros
            - fecha : dia seleccionada en el calendario
            - ubic : sensores seleccionados en los filtros
            - ind : gas seleccionado en los filtros
    */

    const [mes, setMes] = useState(null);
    const [dataHM, setDataHM] = useState(null);

    const queryAnt = useRef(null);
    const mesAnt = useRef(mes);
    let queryStr = "";

    useEffect(() => {
        if (fecha) {
            // Cuando cambia la fecha seleccionada en el calendario, solo cambiamos el State del mes si sí cambió el mes
            if (!mes || !mes.isSame(fecha.clone().startOf('month'))) {
                mesAnt.current = mes;
                setMes(fecha.clone().startOf('month'));
            }
        }
    }, [fecha]);

    useEffect(() => {
        let newq = "";
        if (q) {
            newq = q.substring(0, q.indexOf("&inicio")); // solo nos interesa saber las ubicaciones y gases seleccionados
        }

        if (!queryAnt.current || queryAnt.current !== newq || mesAnt.current != mes) { // Cambió la ubicación y gases seleccionados o el mes seleccionado
            if (queryAnt.current !== q) queryAnt.current = newq;
            if (mesAnt.current != mes) mesAnt.current = mes;

            if (ubic && mes) {
                // Creamos query, sacando los datos de todo el mes
                queryStr = 'ubic=';

                // ubic.forEach((element) => {
                //     queryStr += element.value + ',';
                // });

                queryStr += ubic.value

                // queryStr = queryStr.slice(0, -1);
                queryStr +=
                    '&ind=' + ind +
                    '&inicio=' + mes.clone().format("YYYY-MM-DD") +
                    '&fin=' + mes.clone().endOf('month').format('YYYY-MM-DD');


                console.log("Query HM: " + queryStr);
                fetch(`${apiUrl}/prom-data?${queryStr}`)
                    .then(response => response.json())
                    .then((json) => setDataHM(json))
                    .catch((e) => console.log(e));

            }
        }
    }, [q, mes]);

    // Creación del Heatmap:
    var options = {}; // Configuración
    var series = []; // Datos

    if (q && dataHM && dataHM.length > 0) {
        /* EJEMPLO DEL FORMATO
        series:[
            {
                name: dataHM[i]["zona"]
                data: [
                    {
                        x: número del día,
                        y: dataHM[i][ind],
                        fecha: dataHM[i][fecha].format("DD-MM-YYYY")
                    }
                ]
            }
        ] */
        let index = 0;
        let dataItem = {};

        // Este codigo de abajo se cambio porque ya no era un array de ubicaciones se cambio solo a una ubicación

        // for (let u = 0; u < ubic.length && dataHM[index]; u++) { // Por cada ubicacion seleccionada se crea una fila del heatmap
        // let currUbic = dataHM[index]["zona"];
        let currUbic = dataHM[index]["zona"];
        let primerDia = new Date(dataHM[index].fecha.replace(/-/g, '\/').replace(/T.+/, '')); // primer día registrado de los datos de una ubicacion
        let currDia = 1;

        let seriesItem = {
            name: currUbic,
            data: []
        };

        // llenar primeros días vacíos si es que los datos del mes no empiezan en el primer día
        while (primerDia.getDate() !== currDia) {
            dataItem.x = currDia;
            dataItem.y = -1;
            seriesItem.data.push({ ...dataItem });
            currDia++;
        }


        // ahora sí hay datos
        while (index < dataHM.length && dataHM[index]["zona"] === currUbic) {
            dataItem.x = currDia;

            // revisa que sí haya un registro de ese dia checando si coincide el número de día
            if (currDia == parseInt(dataHM[index]["fecha"].substring(8))) {
                if (dataHM[index]["prom"] !== "") {
                    dataItem.y = dataHM[index]["prom"];
                    dataItem.fecha = dataHM[index]["fecha"];
                } else {
                    dataItem.y = -1;
                }
                index++;
            } else {
                dataItem.y = -1;
            }

            seriesItem.data.push({ ...dataItem });
            currDia++;
        }

        series.push({ ...seriesItem });
        // }

        //console.log(series);

        options = {
            chart: {
                type: 'heatmap',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                heatmap: {
                    enableShades: false,
                    radius: 1,
                    useFillColorAsStroke: false,
                    colorScale: {
                        ranges: [
                            {
                                from: -2,
                                to: 0,
                                name: 'No data',
                                color: '#D3D3D3'
                            },
                            {
                                from: 0,
                                to: criteria['Aire y Salud'][ind][0],
                                name: 'Buena',
                                color: '#00E400'
                            },
                            {
                                from: criteria['Aire y Salud'][ind][0],
                                to: criteria['Aire y Salud'][ind][1],
                                name: 'Aceptable',
                                color: '#FFFF00'
                            },
                            {
                                from: criteria['Aire y Salud'][ind][1],
                                to: criteria['Aire y Salud'][ind][2],
                                name: 'Mala',
                                color: '#FF7E00'
                            },
                            {
                                from: criteria['Aire y Salud'][ind][2],
                                to: criteria['Aire y Salud'][ind][3],
                                name: 'Muy mala',
                                color: '#FF0000'
                            },
                            {
                                from: criteria['Aire y Salud'][ind][3],
                                to: criteria['Aire y Salud'][ind][3] * 1.5,
                                name: 'Extremadamente mala',
                                color: '#8F3F97'
                            }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 1
            },
            xaxis: {
                position: "bottom"
            },
            legend: {
                position: "top",
                showForSingleSeries: true
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    if (series[seriesIndex][dataPointIndex] !== -1) {
                        return '<div class="arrow_box hmTooltip">' +
                            '<p>' + w.globals.initialSeries[seriesIndex].data[dataPointIndex].fecha + '</p>' +
                            '<p><b>' + series[seriesIndex][dataPointIndex].toFixed(4) + ' ' +
                            unidad[ind] + '</b></p>' +
                            '</div>'
                    }
                    return '<div style="display:none;">'
                }
            }
        };

        //console.log("done");
    }


    return (
        <div>
            <h3 className="mb-5">Promedios diarios del mes</h3>
            {q && (<Chart options={options} series={series} type="heatmap" height={series.length * 100} />)}
        </div>
    );
}



export default HeatMap
