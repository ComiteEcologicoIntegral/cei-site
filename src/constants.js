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

export const unidad = {
    PM25: "µg/m3",
    PM10: "µg/m3",
    CO: "ppm",
    O3: "ppm",
    NO2:"ppm", 
    SO2: "ppm"
};
export const mapBlacklist = ['Sinaica'];

export const apiUrl =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL
        : 'http://127.0.0.1:8000';
