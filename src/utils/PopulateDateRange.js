export function populateDateRange(startDate, endDate) {
  let diff = (endDate - startDate) / 864e5;
  const datesFromStartToEnd = Array.from({ length: diff + 1 }, (_, i) => {
    const date = new Date(startDate.getTime());
    date.setDate(startDate.getDate() + i);
    return date;
  });
  return datesFromStartToEnd;
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1);
}

export function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0);
}

export function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export function toLocalISOTime(date) {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  return (new Date(date - tzoffset)).toISOString().slice(0, -1);
}
