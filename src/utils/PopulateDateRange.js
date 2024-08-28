import moment from "moment";

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function populateDateRange(startDate, stopDate) {
  var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
  return dateArray;
}

export function getFirstAndLastDayOfMonth(year, month) {
  return {
    first: getFirstDayOfMonth(year, month),
    last: getDateLastDayOfMonth(year, month)
  }
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1);
}

export function getDateLastDayOfMonth(year, month) {
  const lastDayMoment = moment().year(year).month(month).endOf('month').startOf('day');
  return lastDayMoment.toDate();
}

export function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

// TODO: fix this function
export function toLocalISOTime(date) {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  return (new Date(date - tzoffset)).toISOString().slice(0, -1);
}
