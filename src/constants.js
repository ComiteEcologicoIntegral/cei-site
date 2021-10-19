export const gases = [
    {
        name: 'PM25',
        label: 'PM2.5',
        units: 'μg/m3',
    },
    {
        name: 'PM10',
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

// Opciones del dropdown de sistemas:
export const systemOptions = [
    {value: "PurpleAir", label: 'PurpleAir', opt: 'P'},
    {value: "Sinaica", label: 'Sinaica', opt: 'G'},
    {value: "AireNuevoLeon", label: 'AireNuevoLeon', opt: 'G'}
]

// Opciones del dropdown de gases:
export const indicadores = [
    { value: 'PM25', label: 'PM2.5' },
    { value: 'PM10', label: 'PM10' },
    { value: 'O3', label: 'O3' },
    { value: 'CO', label: 'CO' },
    { value: 'NO2', label: 'NO2' },
    { value: 'SO2', label: 'SO2' },
];

export const unidad = {
    PM25: 'µg/m3',
    PM10: 'µg/m3',
    CO: 'ppm',
    O3: 'ppm',
    NO2: 'ppm',
    SO2: 'ppm',
};
export const idBlacklist = [
    'P36757',
    'P47305',
    'P39499',
    'P46239',
    'P50855',
    'P35099',
    'P39709',
    'P39497',
    'P39285',
    'P39355',



];
export const idBlacklistpriv = [
    'P39497',
    'P39285',
    'P39355'

];
export const mapBlacklist = [
    'Sinaica', 

];

export const apiUrl =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL
        : 'http://127.0.0.1:8000';
