export const criteria = {
  ssa: {
    PM10: [50, 70, 155, 235],
    PM25: [25, 41, 78, 147],
    O3: [0.051, 0.09, 0.135, 0.175],
    CO: [8.75, 9.0, 13.3, 15.5],
    SO2: [0.015, 0.04, 0.165, 0.22],
    NO2: [0.103, 0.106, 0.23, 0.25],
  },
  semarnat: {
    PM10: [50, 75, 155, 235],
    PM25: [25, 45, 79, 147],
    O3: [0.051, 0.070, 0.092, 0.114],
    CO: [8.75, 11.00, 13.30, 15.50],
    SO2: [0.008, 0.110, 0.165, 0.220],
    NO2: [0.107, 0.210, 0.230, 0.250],
  },
  oms: {
    PM10: [100, 135, 214, 300],
    PM25: [55, 75, 97.4, 128.8],
    O3: [0.051, 0, 0, 0],
    CO: [8, 8, 8, 8],
    SO2: [0.015, 0, 0, 0],
    NO2: [0.132, 0.176, 0.221, 0.289],
  },
};

export const airQualityTags = ["buena", "acept", "mala", "muy", "ext"];

export const getStatus = (gas, value, norm = "ssa") => {
  const breakpoints = criteria[norm][gas];

  for (let i = breakpoints.length - 1; i >= 0; i--) {
    if (value > breakpoints[i]) {
      return parseInt(i) + 1;
    }
  }

  return 0;
};
