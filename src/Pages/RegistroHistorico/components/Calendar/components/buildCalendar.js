export default function buildCalendar(value) {
    // Función para ayudar a construir el DatePicker
    const startDay = value.clone().startOf("month").startOf("isoWeek"); // primer domingo antes del primero del mes
    const endDay = value.clone().endOf("month").endOf("isoWeek").subtract(1, "day"); // último sábado después del fin de mes

    const day = startDay.clone().subtract(2, "day");
    const calendar = [];

    // Crea las semanas del calendario
    while (day.isBefore(endDay, "day")) {
        calendar.push(
            Array(7).fill(0).map(() => day.add(1, "day").clone())
        )
    }

    return calendar;
}