import { criteria, statusClassName, statusClassOrder } from "../constants";

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
    return statusClassName.Good;
  } else if (avg >= 51 && avg <= 100) {
    return statusClassName.Acceptable;
  } else if (avg >= 101 && avg <= 150) {
    return statusClassName.Bad;
  } else if (avg >= 151 && avg <= 200) {
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

  for (let limit_index = 0; limit_index < limits.length; limit_index++) {
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
    return statusClassName.Good;
  } else if (avg >= 5 && gas === "PM25") {
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 44.5 && gas === "PM10") {
    return statusClassName.Good;
  } else if (avg >= 45 && gas === "PM10") {
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 99.9 && gas === "O3") {
    return statusClassName.Good;
  } else if (avg >= 100 && gas === "O3") {
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 24.9 && gas === "NO2") {
    return statusClassName.Good;
  } else if (avg >= 25 && gas === "NO2") {
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 39.9 && gas === "SO2") {
    return statusClassName.Good;
  } else if (avg >= 40 && gas === "SO2") {
    return statusClassName.SuperBad;
  } else if (avg > 0 && avg <= 3999 && gas === "CO") {
    return statusClassName.Good;
  } else if (avg >= 4000 && gas === "CO") {
    return statusClassName.SuperBad;
  }
}
