import React, { useState, useEffect } from 'react'
import buildCalendar from './buildCalendar';
import { Col, Row } from 'react-bootstrap';
import { v4 } from 'uuid';

const DatePicker = ({value, onChange}) => {

    const [calendar, setCalendar] = useState([]);

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
                <Col  sm={3} className="next" onClick={() => !currMonth() && onChange(nextMonth)}>
                    {!currMonth() ? String.fromCharCode(187) : null}
                </Col>
            </Row>
            </div>
            <div className="body">
                <div className="day-names">
                    {
                        ["D", "L", "M" , "M" , "J", "V" , "S"].map((d,i) => 
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
                            <div className={dayStyles(day)} key={v4()}>
                                { day.format("D") }
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
