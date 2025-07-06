/**
 * buildCalendar.js
 *
 * This file defines the buildCalendar utility function, which generates a matrix of dates
 * representing the weeks and days to display in a monthly calendar view for a given moment.js date.
 *
 * Features:
 * - Calculates the start and end boundaries for the calendar grid
 * - Fills the calendar with date objects for each day in the visible range
 * - Returns a 2D array (weeks x days) for use in calendar components
 *
 * Dependencies:
 * - moment.js (date manipulation)
 *
 * Last updated: [?]
 */

export default function buildCalendar(value) {
    // Function to help build the DatePicker
    const startDay = value.clone().startOf("month").startOf("isoWeek"); // primer domingo antes del primero del mes
    const endDay = value.clone().endOf("month").endOf("isoWeek").subtract(1, "day"); // último sábado después del fin de mes

    const day = startDay.clone().subtract(2, "day");
    const calendar = [];

    // Creates the weeks of the calendar
    while (day.isBefore(endDay, "day")) {
        calendar.push(
            Array(7).fill(0).map(() => day.add(1, "day").clone())
        )
    }

    return calendar;
}