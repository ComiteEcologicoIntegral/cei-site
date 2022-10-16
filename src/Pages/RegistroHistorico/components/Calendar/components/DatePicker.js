import React, { useState, useEffect, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { v4 } from 'uuid';
import { apiUrl, unidad } from '../../../../../constants';
import { criteria } from '../../../../../handlers/statusCriteria';
import buildCalendar from './buildCalendar';

const colors = ['rgb(240, 239, 239)',  //N/D
                "rgb(76, 187, 23)", 
                "rgb(253, 218, 13)", 
                "rgb(254,90,29)", 
                "rgb(238, 75, 43)", 
                "rgb(143, 63, 151)"];

// Componente para el calendario en la página de Registro Histórico
const DatePicker = ({ q, fecha, ubic, ind, value, onChange }) => {
    /* 
        Se siguió este tutorial : https://youtu.be/5jRrVqRWqsM

        Parámetros:
            - value: día seleccionado
            - onChange: función para cambiar el State de value
            - fecha : dia seleccionada en el calendario
            - ubic : sensores seleccionados en los filtros
    */

    const [calendar, setCalendar] = useState([]);

    const [mes, setMes] = useState(null);
    const [dataHM, setDataHM] = useState(null);

    const queryAnt = useRef(null);
    const mesAnt = useRef(mes);

    // build calendar
    let queryStr = "";
    useEffect(() => {
        setCalendar(buildCalendar(value));
        if (fecha) {
            // Cuando cambia la fecha seleccionada en el calendario, solo cambiamos el State del mes si sí cambió el mes
            if (!mes || !mes.isSame(fecha.clone().startOf('month'))) {
                mesAnt.current = mes;
                setMes(fecha.clone().startOf('month'));
            }
        }
        let newq = "";
        if (q) {
            newq = q.substring(0, q.indexOf("&inicio")); // solo nos interesa saber las ubicaciones y gases seleccionados
        }

        if (!queryAnt.current || queryAnt.current !== newq || mesAnt.current !== mes) { // Cambió la ubicación y gases seleccionados o el mes seleccionado
            if (queryAnt.current !== q) queryAnt.current = newq;
            if (mesAnt.current !== mes) mesAnt.current = mes;

            if (ubic && mes) {
                // Creamos query, sacando los datos de todo el mes
                queryStr = 'ubic=';
                queryStr += ubic.value

                queryStr +=
                    '&ind=' + ind +
                    '&inicio=' + mes.clone().format("YYYY-MM-DD") +
                    '&fin=' + mes.clone().endOf('month').format('YYYY-MM-DD');


                fetch(`${apiUrl}/prom-data?${queryStr}`)
                    .then(response => response.json())
                    .then((json) => setDataHM(json))
                    .catch((e) => console.log(e));

            }
        }
    }, [value, fecha, q, mes]);

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
            if (currDia === parseInt(dataHM[index]["fecha"].substring(8))) {
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
    }

    function isSelected(day) {
        return value.isSame(day, "day");
    }

    function afterToday(day) {
        return day.isAfter(new Date(), "day");
    }

    function isToday(day) {
        return day.isSame(new Date(), "day");
    }

    function sameMonth(day) {
        return day.isSame(value, "month");
    }

    function colorStatus(day) {
        if(series.length !== 0)
        {
            const x = series[0]["data"][day.format('D')-1]
            if (typeof(x) !== "undefined")
            {
                const y = x["y"]

                if (y < 0) {
                    return colors[0] // No Data
                } 
                if (y < criteria['Aire y Salud'][ind][0]) {
                    return colors[1]
                }
                if (y < criteria['Aire y Salud'][ind][1]) {
                    return colors[2]
                }
                if (y < criteria['Aire y Salud'][ind][2]) {
                    return colors[3]
                }
                if (y < criteria['Aire y Salud'][ind][3]) {
                    return colors[4]
                }
                if (y > criteria['Aire y Salud'][ind][3]) {
                    return colors[5]
                }
            }    
        }
       return colors[0]
    }

    function toolTip(day) {
        if(series.length !== 0)
        {
            const x = series[0]["data"][day.format('D')-1]
            if (typeof(x) !== "undefined")
            {
                const y = x["y"].toFixed(2)
                return y + ' ' + unidad[ind] 
            }    
        }
       return "N/D" 
    }    

    function dayStyles(day) {
        if (isSelected(day)) return "selected"
        if (isToday(day)) return "today"
        if (afterToday(day)) return "after"
        if (!sameMonth(day)) return "month"
        return ""
    }

    function currMonthName() {
        return value.format("MMM")
    }

    function currYear() {
        return value.format("YYYY")
    }

    function prevMonth() {
        return value.clone().subtract(1, "month")
    }

    function nextMonth() {
        return value.clone().endOf("month").add(1, "day")
    }

    function currMonth() {
        return value.isSame(new Date(), "month")
    }

    function isFirstMonthRegistered() {
        return value.isSame(new Date("01-01-2018"), "month")
    }

    return (
        <div className="calendar mt-5">
            <div className="cal-header">
                <Row>
                    <Col sm={3} className="previous" onClick={() => !isFirstMonthRegistered() && onChange(prevMonth)}>
                        {!isFirstMonthRegistered() ? String.fromCharCode(171) : null}
                    </Col>
                    <Col sm={6} className="current">
                        {currMonthName()}, {currYear()}
                    </Col>
                    <Col sm={3} className="next" onClick={() => !currMonth() && onChange(nextMonth)}>
                        {!currMonth() ? String.fromCharCode(187) : null}
                    </Col>
                </Row>
            </div>
            <div className="body">
                <div className="day-names">
                    {
                        ["D", "L", "M", "M", "J", "V", "S"].map((d, i) =>
                            <div className="weekday" key={i}>{d}</div>
                        )
                    }
                </div>
                {
                    calendar.map((week, w) =>
                        <div key={w}>
                            {
                                week.map((day, i) => <div className="day"
                                    onClick={() => !afterToday(day) && onChange(day)}>
                                    <div className={dayStyles(day)} style={{ backgroundColor: colorStatus(day), "borderRadius": "5px" }}key={v4()}>
                                        {day.format("D")}
                                        <span>{toolTip(day)}</span>
                                    </div>
                                </div>
                                )
                            }

                        </div>)
                }
            </div>
        </div>
    )
}

export default DatePicker
