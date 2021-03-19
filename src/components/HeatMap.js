import React, { useState, useEffect } from 'react'
import moment from 'moment'
import '../styles/calendario.css';
import buildCalendar from './buildCalendar';
import { Col, Row } from 'react-bootstrap'

const HeatMap = () => {

    const [calendar, setCalendar] = useState([]);
    const [value, setValue] = useState(moment()); // currently selected date

    // build calendar

    useEffect(() => {
         setCalendar(buildCalendar(value));
    }, [value]);
    
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
        return value.clone().add(1, "month")
    }

    function currMonth() {
        return value.isSame(new Date(), "month")
    }

    return (
        <div className="calendar mt-5">
            <div className="cal-header">
            <Row>
                <Col className="previous" onClick={() => setValue(prevMonth)}>
                    {String.fromCharCode(171)}
                </Col>
                <Col className="current">
                    {currMonthName()}, {currYear()}
                </Col>
                <Col className="next" onClick={() => !currMonth() && setValue(nextMonth)}>
                    {!currMonth() ? String.fromCharCode(187) : null}
                </Col>
            </Row>
            </div>
            <div className="body">
                <div className="day-names">
                    {
                        ["D", "L", "M" , "M" , "J", "V" , "S"].map(d => 
                                <div className="weekday">{d}</div>
                            )
                    }
                </div>
            { 
                calendar.map((week) => 
                <div>
                    {
                        week.map((day) => <div className="day"
                            onClick={() => setValue(day)}>
                            <div className={dayStyles(day)}>
                                { day.format("D") }
                            </div>
                        </div>)
                    }
                </div>) 
            
            }
            </div>
        </div>
    )
}

export default HeatMap
