// Los valores en estas listas deben estar en orden ascendiente
export const criteria = {
  ssa: {
    PM10: [50, 70, 155, 235],
    PM25: [25, 41, 79, 147],
    O3: [0.065, 0.07, 0.092, 0.114],
    CO: [8.75, 9.0, 13.3, 15.5],
    SO2: [0.015, 0.04, 0.165, 0.22],
    NO2: [0.103, 0.106, 0.23, 0.25],
  },
  semarnat: {
    PM10: [50, 75, 155, 235],
    PM25: [25, 45, 79, 147],
    O3: [0.051, 0.07, 0.092, 0.114],
    CO: [8.75, 11.0, 13.3, 15.5],
    SO2: [0.008, 0.11, 0.165, 0.22],
    NO2: [0.107, 0.21, 0.23, 0.25],
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

const statusClassOrder = [
  "Good",
  "Acceptable",
  "Bad",
  "SuperBad",
  "ExtremelyBad",
  "NoData",
];

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

export function getStatusClassName(avg, gas, norm) {
  if (avg < 0 || !avg || avg === "" || avg === "ND") {
    return statusClassName.NoData;
  } else if (avg > 0 && avg <= 50) {
    avg = criteria[norm][gas][0];
    return statusClassName.Good;
  } else if (avg >= 51 && avg <= 100) {
    avg = criteria[norm][gas][1];
    return statusClassName.Acceptable;
  } else if (avg >= 101 && avg <= 150) {
    avg = criteria[norm][gas][2];
    return statusClassName.Bad;
  } else if (avg >= 151 && avg <= 200) {
    avg = criteria[norm][gas][3];
    return statusClassName.SuperBad;
  } else {
    return statusClassName.ExtremelyBad;
  }
}

export function getICAR(avg, gas, norm) {
  const limits = criteria[norm][gas];

  if (avg < 0 || !avg || avg === "" || avg === "ND") {
    return statusClassName.NoData;
  }

  for (var limit_index = 0; limit_index < limits.length; limit_index++) {
    if (avg <= limits[limit_index]) {
      return statusClassName[statusClassOrder[limit_index]];
    }
  }
  // Si no es menor que ninguno, es de la peor calidad posible
  return statusClassName.ExtremelyBad;
}

export function getStatusOMS(avg, gas, norm) {
  if (avg < 0 || !avg || avg === "" || avg === "ND") {
    return statusClassName.NoData;
  } else if (avg > 0 && avg <= 4.9 && gas === "PM25") {
    avg = criteria[norm][gas][0];
    return statusClassName.Good;
  } else if (avg >= 5 && gas === "PM25") {
    avg = criteria[norm][gas][3];
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 44.5 && gas === "PM10") {
    avg = criteria[norm][gas][0];
    return statusClassName.Good;
  } else if (avg >= 45 && gas === "PM10") {
    avg = criteria[norm][gas][3];
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 99.9 && gas === "O3") {
    avg = criteria[norm][gas][0];
    return statusClassName.Good;
  } else if (avg >= 100 && gas === "O3") {
    avg = criteria[norm][gas][3];
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 24.9 && gas === "NO2") {
    avg = criteria[norm][gas][0];
    return statusClassName.Good;
  } else if (avg >= 25 && gas === "NO2") {
    avg = criteria[norm][gas][3];
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 39.9 && gas === "SO2") {
    avg = criteria[norm][gas][0];
    return statusClassName.Good;
  } else if (avg >= 40 && gas === "SO2") {
    avg = criteria[norm][gas][3];
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 3999 && gas === "CO") {
    avg = criteria[norm][gas][0];
    return statusClassName.Good;
  } else if (avg >= 4000 && gas === "CO") {
    avg = criteria[norm][gas][3];
    return statusClassName.SuperBad;
  }
}
