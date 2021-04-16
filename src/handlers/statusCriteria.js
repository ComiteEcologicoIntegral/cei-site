export const criteria = {
    'Aire y Salud': {
        PM10: [76, 156, 236, 277],
        PM25: [46, 80, 148, 214],
        O3: [0.107, 0.13, 0.154, 0.184],
        CO: [11.1, 13.31, 15.51, 18.61],
        SO2: [0.111, 0.166, 0.221, 0.301],
        NO2: [0.211, 0.231, 0.251, 0.271],
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

export const getStatus = (gas, value, norm = 'Aire y Salud') => {
    const breakpoints = criteria[norm][gas];

    for (let i = breakpoints.length - 1; i >= 0; i--) {
        if (value >= breakpoints[i]) {
            return parseInt(i) + 1;
        }
    }

    return 0;
};
