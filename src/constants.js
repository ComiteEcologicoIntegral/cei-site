export const gases = [
    {
        name: 'PM10',
        units: 'μg/m3',
    },
    {
        name: 'PM25',
        units: 'μg/m3',
    },
    {
        name: 'O3',
        units: 'ppm',
    },
    {
        name: 'CO',
        units: 'ppm',
    },
    {
        name: 'NO2',
        units: 'ppm',
    },
    {
        name: 'SO2',
        units: 'ppm',
    },
];

export const apiUrl =
    process.env.NODE_ENV === 'production'
        ? process.env.API_URL
        : 'http://127.0.0.1:8000';
