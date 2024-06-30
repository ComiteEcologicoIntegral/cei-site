import React, { useState, useEffect, useCallback } from "react";
import ReactCalendar from "react-calendar";
import { dateFormat, statusClassName } from "../../../constants"
import { isSameDay } from "../../../utils/PopulateDateRange";
import "./Calendar.css";
import "./DayBullet.css";
import { capitalizeFirstLetter } from "../../../utils/stringUtils";


const DayBullet = (props) => {
  const { count, text, type } = props;
  return (
    <div className="day-bullet">
      <div className={`count ${type}`}>{count}</div>
      <div className="text">{text}</div>
    </div>
  );
};

function Calendar({ calendarData, selectedDate, setSelectedDate, datesOfTheMonth, avgType }) {

  const [dayCount, setDayCount] = useState(null);

  useEffect(() => {
    if (!calendarData) return;
    let tmpDayCount = {
      good: 0,
      "regular": 0,
      bad: 0,
      "very_bad": 0,
      "extremely_bad": 0,
      "no-data": 0
    };

    datesOfTheMonth.forEach((date) => {
      if (calendarData[date.getDate() - 1]) {
        let status = calendarData[date.getDate() - 1].status
        tmpDayCount[status]++;
      }
    });

    setDayCount(tmpDayCount);
  }, [datesOfTheMonth, calendarData]);


  const getDateStatus = (date) => {
    if (!calendarData) return;
    return calendarData[date.getDate() - 1].status;
  }

  const tileClassName = useCallback(
    ({ date, view }) => {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesOfTheMonth.find((dDate) => isSameDay(dDate, date))) {
        if (!calendarData || !calendarData[date.getDate() - 1] || !avgType.value) {
          return;
        }
        return getDateStatus(date);
      } else {
        return "out-of-range";
      }
    },
    [calendarData]
  );

  return (
    <div className="mb-1">
      <ReactCalendar
        locale={"es-MX"}
        onChange={(date) => {
          setSelectedDate(date);
        }}
        value={selectedDate}
        tileClassName={tileClassName}
      />
      <p className="mt-3">
        {capitalizeFirstLetter(selectedDate.toLocaleDateString("es-MX", dateFormat))}
      </p>

      {dayCount && (
        <div className="day-count">
          <h4 className="mt-4">Conteo de días</h4>
          <DayBullet
            count={dayCount.good}
            text="Buena"
            type={statusClassName.Good}
          />
          <DayBullet
            count={dayCount.regular}
            text="Aceptable"
            type={statusClassName.Regular}
          />
          <DayBullet
            count={dayCount.bad}
            text="Mala"
            type={statusClassName.Bad}
          />
          <DayBullet
            count={dayCount["very_bad"]}
            text="Muy mala"
            type={statusClassName.VeryBad}
          />
          <DayBullet
            count={dayCount["extremely_bad"]}
            text="Extremadamente mala"
            type={statusClassName.ExtremelyBad}
          />
          <DayBullet
            count={dayCount["no-data"]}
            text="No hay datos"
            type={statusClassName.NoData}
          />
        </div>
      )}
    </div>
  );
}

export default Calendar;
