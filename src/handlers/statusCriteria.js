export const criteria = {
  ssa: {
    PM10: [50, 70, 155, 235],
    PM25: [25, 41, 79, 147],
    O3: [0.065, 0.070, 0.092, 0.114],
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
    PM10: [45, 45, 45, 45],
    PM25: [15, 15, 15, 15],
    O3: [0.051, 0.051, 0.051, 0.051],
    CO: [8, 8, 8, 8],
    SO2: [0.015, 0.015, 0.015, 0.015],
    NO2: [0.013, 0.013, 0.013, 0.013],
  },
};


export const statusClassName = {
  Good: "good",
  Acceptable: "acceptable",
  Bad: "bad",
  SuperBad: "super-bad",
  ExtremelyBad: "extremely-bad",
  NoData: "no-data",
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

export function getDateStatusClassName(avg, gas, norm) {
    const dayAverage = avg;
    if (dayAverage < 0) {
      return statusClassName.NoData;
    }
    else if (dayAverage < criteria[norm][gas][0]) {
      return statusClassName.Good;
    }
    else if (dayAverage < criteria[norm][gas][1]) {
      return statusClassName.Acceptable;
    }
    else if (dayAverage < criteria[norm][gas][2]) {
      return statusClassName.Bad;
    }
    else if (dayAverage < criteria[norm][gas][3]) {
      return statusClassName.SuperBad;
    }
    else {
      return statusClassName.ExtremelyBad;
    }
  }
