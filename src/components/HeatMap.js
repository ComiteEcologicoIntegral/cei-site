import React, { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
import { apiUrl } from '../constants';
import { criteria } from '../handlers/statusCriteria';
import { unidad } from '../constants';
import moment from 'moment';
import promdata from '../handlers/prom-data.json';
import userEvent from '@testing-library/user-event';

function HeatMap ({q, fecha, ubic, ind}) {
    const [mes, setMes] = useState(null); 
    const [dataHM, setDataHM] = useState(null);

    const queryAnt = useRef(null);
    const mesAnt = useRef(mes);
    let queryStr = "";

    useEffect(() => {
        if (fecha) {
            if (!mes || !mes.isSame(fecha.clone().startOf('month'))) {
                mesAnt.current = mes;
                setMes(fecha.clone().startOf('month'));
            }
        }
    }, [fecha]);

    useEffect(() => {
        // solo cambia el heatmap cuando cambia el query de RHFiltros o el mes de la fecha seleccionada
        let newq = "";
        if (q) {
            newq = q.substring(0, q.indexOf("&inicio"));
        }

        if (!queryAnt.current || queryAnt.current !== newq || mesAnt.current != mes) {
            if (queryAnt.current !== q) queryAnt.current = newq;
            if (mesAnt.current != mes) mesAnt.current = mes;

            if (ubic && mes) {
                // create query 
                queryStr = 'ubic=';

                ubic.forEach((element) => {
                    queryStr += element.value + ',';
                });

                queryStr = queryStr.slice(0, -1);
                queryStr +=
                    '&ind=' + ind +
                    '&inicio=' + mes.clone().format("YYYY-MM-DD") +
                    '&fin=' + mes.clone().endOf('month').format('YYYY-MM-DD');

                    
                //console.log("Query HM: " + queryStr);

                fetch(`${apiUrl}/prom-data?${queryStr}`)
                    .then(response => response.json())
                    .then((json) => setDataHM(json))
                    .catch((e) => console.log(e));
            
                
                //console.log("done hm");
                //setDataHM(promdata);
            }
        }
    }, [q, mes]);

    var options = {};
    var series = [];

    if (q && dataHM && dataHM.length > 0) {
        /* EJEMPLO
        series:[
            {
                name: dataHM[i]["zona"]
                data: [
                    {
                        x: category[i%7],
                        y: dataHM[i][ind],
                        fecha: dataHM[i][fecha].format("DD-MM-YYYY")
                    }
                ]
            }
        ] */
        let index = 0;
        let dataItem = {};

        for (let u = 0; u < ubic.length && dataHM[index]; u++) { // por cada ubicacion seleccionada
            let currUbic = dataHM[index]["zona"];
            let primerDia = new Date(dataHM[index].fecha.replace(/-/g, '\/').replace(/T.+/, '')); // primer día registrado de los datos de una ubicacion
            let currDia = 1;

            let seriesItem = {
                name : currUbic,
                data: []
            };
            
            // llenar primeros días vacíos
            while (primerDia.getDate() !== currDia) {
                dataItem.x = currDia;
                dataItem.y = -1;
                seriesItem.data.push({...dataItem});
                currDia++;
            }
            

            // ahora sí hay datos
            while (index < dataHM.length && dataHM[index]["zona"] === currUbic) {
                dataItem.x = currDia;

                // revisa que haya datos de ese dia
                if (currDia == parseInt(dataHM[index]["fecha"].substring(8))) {
                    dataItem.y = dataHM[index]["prom"];
                    dataItem.fecha = dataHM[index]["fecha"];
                    index++;
                } else {
                    dataItem.y = -1;
                }

                seriesItem.data.push({...dataItem});
                currDia++;
            }

            series.push({...seriesItem});
        }

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
                        color: '#95BF39'
                    },
                    {
                        from: criteria['Aire y Salud'][ind][0],
                        to: criteria['Aire y Salud'][ind][1],
                        name: 'Aceptable',
                        color: '#F2E313'
                    },
                    {
                        from: criteria['Aire y Salud'][ind][1],
                        to: criteria['Aire y Salud'][ind][2],
                        name: 'Mala',
                        color: '#F2811D'
                    },
                    {
                        from: criteria['Aire y Salud'][ind][2],
                        to: criteria['Aire y Salud'][ind][3],
                        name: 'Muy mala',
                        color: '#F22233'
                    },
                    {
                        from: criteria['Aire y Salud'][ind][3],
                        to: criteria['Aire y Salud'][ind][3] * 1.5,
                        name: 'Extremadamente mala',
                        color: '#73022C'
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
                custom: function({series, seriesIndex, dataPointIndex, w}) {
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
            {q && (<Chart options={options} series={series} type="heatmap" height={series.length * 100}/>)}
        </div>
    );
}



export default HeatMap
