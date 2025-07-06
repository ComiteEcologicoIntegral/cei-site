/**
 * Calendar.js
 * 
 * This file defines the Calendar component, which renders a monthly view 
 * with customizable day cells and color-coded indicators based on sensor data.
 * 
 * Features:
 * - Displays a calendar view of the current month
 * - Highlights days with relevant environmental data
 * - Accepts callbacks for selecting dates
 * - Shows a count of days by category (e.g. Good, Regular, Bad, etc.)
 * 
 * Dependencies: 
 * - React (hooks: useState, useEffect, useCallback)
 * - moment.js
 * - Custom Utility: dateFormat, isSameDay, capitalizeFirstLetter
 * - Styles: Calendar.css, DayBullet.css
 * 
 * Last update:[?]
 */


//React and external libraries
import React, { useState, useEffect, useCallback } from "react";
import ReactCalendar from "react-calendar";
//Constants and utility functions
import { dateFormat, statusClassName } from "../../../constants"
import { isSameDay } from "../../../utils/PopulateDateRange";
//Style-sheets
import "./Calendar.css";
import "./DayBullet.css";
import { capitalizeFirstLetter } from "../../../utils/stringUtils";

/**
 * Daybullet
 * 
 * Visual subcomponent that displays a label with a count of days under a specific air quality category.
 * 
 * Propos:
 * - count (number): Total number of days
 * - text (string): Label to display (e.g. "Buena", "Mala")
 * - type (string): CSS class for visual status coloring
*/

const DayBullet = (props) => {
  const { count, text, type } = props;
  return (
    <div className="day-bullet">
      <div className={`count ${type}`}>{count}</div>
      <div className="text">{text}</div>
    </div>
  );
};

/**
 * Calendar
 * 
 * Main component that renders an interactive calendar with colored indicators for each day.
 * It allows users to select a date and view categorized data summaries for air quality levels.
 * 
 * Props: 
 * - calendarData (Array): Array of daily data including status for each date
 * - selectedDate (Date): Currently selected date
 * - setSelectedDate (Function): Updates the selected date state
 * - datesOfTheMonth (Array): List of Date objects corresponding to current month
 * - avgType (Object): Average calculation type (with property `value`)
 */
function Calendar({ calendarData, selectedDate, setSelectedDate, datesOfTheMonth, avgType }) {

  const [dayCount, setDayCount] = useState(null);

/**
 * useEffect
 * 
 * Recalculates the total count of days per status category whenever
 * the list of dates or calendar data is updated.
 */
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

/**
 * getDateStatus
 * 
 * Returns the air quality status string for a specific date, as extracted from calendarData.
 * 
 * @param {Date} date - Date to evaluate
 * @returns {string} - Status for the given date (e.g "good","bad")
 */
  const getDateStatus = (date) => {
    if (!calendarData) return;
    return calendarData[date.getDate() - 1].status;
  }
/**
 * tileClassName
 * 
 * Determines the CSS class for each calendar tile based on its date's status.
 * If the date is within the range of valid dates and contains data, it returns a color-coded class.
 * 
 * @param {Object} param0 - Contains the date and view type
 * @returns {string|undefined} - CSS class name to apply to the tile
 */
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
//Render 
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
            type={statusClassName.Acceptable}
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
