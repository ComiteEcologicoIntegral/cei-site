export const criteria = {
    'Aire y Salud': {
        PM10: [50, 75, 155, 235],
        PM25: [25, 45, 78, 147],
        O3: [0.051, 0.095, 0.135, 0.175],
        CO: [8.75, 11.00, 13.30, 15.50],
        SO2: [0.008, 0.110, 0.165, 0.220],
        NO2: [0.107, 0.210, 0.230, 0.250],
    },
    NOM: {
        PM10: [100, 135, 214, 300],
        PM25: [55, 75, 97.4, 128.8],
        O3: [0.07, 0.093, 0.115, 0.137],
        CO: [12, 13.9, 15.9, 18.9],
        SO2: [0.253, 0.345, 0.435, 0.566],
        NO2: [0.132, 0.176, 0.221, 0.289],
    },
};

export const airQualityTags = ["buena", "acept", "mala", "muy", "ext"];

export const getStatus = (gas, value, norm = 'Aire y Salud') => {
    const breakpoints = criteria[norm][gas];

    for (let i = breakpoints.length - 1; i >= 0; i--) {
        if (value > breakpoints[i]) {
            return parseInt(i) + 1;
        }
    }

    return 0;
};
