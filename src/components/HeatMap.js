import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { apiUrl } from '../constants';
import { criteria } from '../handlers/statusCriteria';

const HeatMap = ({q, fecha, ubic, ind}) => {
    
    const [mes, setMes] = useState(null); 
    const [dataHM, setDataHM] = useState(null);

    useEffect(() => {
        if (fecha) {
            setMes(fecha.clone().startOf('month'));
        }
    }, [fecha]);

    useEffect(() => {
        if (ubic && mes) {
            // create query 
            let queryStr = 'ubic=';

            ubic.forEach((element) => {
                queryStr += element.value + ',';
            });

            queryStr = queryStr.slice(0, -1);
            queryStr +=
                '&ind=' + ind +
                '&inicio=' + mes.format("YYYY-MM-DD") +
                '&fin=' + mes.endOf('month').format('YYYY-MM-DD');

            console.log(queryStr);

            // da error CORS
            //fetch(`${apiUrl}/prom-data?${queryStr}`)

            fetch(`${apiUrl}/prom-data?${queryStr}`)
                .then(response => response.json())
                .then((json) => setDataHM(json))
                .catch((e) => console.log(e));

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
        
        var category = ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S']; // dias de la semana

        let primerDia = new Date(dataHM[0].fecha).getDay(); // primer día de la semana de los datos
        let currDiaSem = 0;
        let index = 0; // navegar arreglo de datos

        
        while (index < dataHM.length) {
            let seriesItem = { // representa una semana
                name: dataHM[index]["zona"],
                data: [] // datos de una semana
            };

            let dataItem = {
                // x, y, fecha,,, datos de un día
            };

            if (index == 0 && primerDia != 0) { // llenar los primeros espacios vacios con null
                while (currDiaSem != primerDia) {
                    dataItem.x = category[currDiaSem];
                    dataItem.y = -1;
                    dataItem.fecha = "Mes anterior";
                    seriesItem.data[currDiaSem] = {...dataItem};
                    currDiaSem++;
                }
            }

            while (index < dataHM.length && currDiaSem < 7) {
                dataItem.x = category[currDiaSem];
                dataItem.y = dataHM[index]["prom"];
                dataItem.fecha = dataHM[index]["fecha"];

                seriesItem.data[currDiaSem] = {...dataItem};
                
                index++;
                currDiaSem++;
            }
           
            series.unshift({...seriesItem});
            currDiaSem = 0;
        }

        console.log(series);

        options = {
            chart: {
              height: 300,
              type: 'heatmap',
            },
            plotOptions: {
              heatmap: {
                radius: 10,
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                    {
                        from: -2,
                        to: 0,
                        name: 'No data',
                        color: '#A3A3A3'
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
            title: {
              text: 'Promedio diario del mes'
            },
            xaxis: {
                categories: category,
                position: "top"
            },
            legend: {
                position: "bottom"
            }
          };

        console.log("done");
    }


    return (
        <div>
            {options && (<Chart options={options} series={series} type="heatmap" width={700} />)}
        </div>
    );
}

export default HeatMap
