const fixedValues = {
  PM25: 0,
  PM10: 0,
  O3: 3,
  NO2: 3,
  SO2: 3,
  CO: 2,
};

export const valueToFixed = (val, gas) => {
  console.log("gas", gas, fixedValues[gas])
  return val.toFixed(fixedValues[gas]);
};
