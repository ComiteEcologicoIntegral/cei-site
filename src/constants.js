export const gases = [
  {
    name: "PM25",
    label: "PM2.5",
    units: "μg/m3",
  },
  {
    name: "PM10",
    units: "μg/m3",
  },
  {
    name: "O3",
    units: "ppm",
  },
  {
    name: "CO",
    units: "ppm",
  },
  {
    name: "NO2",
    units: "ppm",
  },
  {
    name: "SO2",
    units: "ppm",
  },
];

// Los valores en estas listas deben estar en orden ascendiente
export const criteria = {
  ssa: {
    PM10: [45, 60, 132, 213],
    PM25: [15, 33, 79, 130],
    O3: [0.058, 0.090, 0.135, 0.175],
    CO: [5.0, 9.0, 12.0, 16.0],
    SO2: [0.035, 0.075, 0.185, 0.304],
    NO2: [0.053, 0.106, 0.160, 0.213],
    
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

export const statusClassOrder = [
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

// Should be the same as the keys from statusClassName
export const statusColor = {
  good: "#95BF39",
  acceptable: "#F2E313",
  bad: "#F2811D",
  "super-bad": "#F22233",
  "extremely-bad": "#73022C",
  "no-data": "#4d4d4d",
};

// Opciones del dropdown de sistemas:
export const systemOptions = [
  { value: "PurpleAir", label: "PurpleAir", opt: "P" },
  { value: "AireNuevoLeon", label: "AireNuevoLeon/Sinaica", opt: "G" },
];

// Opciones del dropdown de gases:
export const gasesOptions = [
  { value: "PM25", label: "PM2.5" },
  { value: "PM10", label: "PM10" },
  { value: "O3", label: "O3" },
  { value: "CO", label: "CO" },
  { value: "NO2", label: "NO2" },
  { value: "SO2", label: "SO2" },
];

export const unidad = {
  PM25: "µg/m3",
  PM10: "µg/m3",
  CO: "ppm",
  O3: "ppm",
  NO2: "ppm",
  SO2: "ppm",
};

export const normOptions = {
  PM25: [
    {
      value: "semarnat",
      label: "NOM-172-SEMARNAT-2023 (Promedio movil 12 horas)",
    },
    { value: "ssa", label: "NOM-025-SSA1-2021 (Promedio movil 24 horas)" },
    { value: "oms", label: "OMS (Promedio 24 horas)" },
  ],
  PM10: [
    {
      value: "semarnat",
      label: "NOM-172-SEMARNAT-2023 (Promedio movil 12 horas)",
    },
    { value: "ssa", label: "NOM-025-SSA1-2021 (Promedio movil 24 horas)" },
    { value: "oms", label: "OMS (Promedio 24 horas)" },
  ],
  CO: [
    {
      value: "semarnat",
      label: "NOM-172-SEMARNAT-2023 (Promedio movil 8 horas)",
    },
    { value: "ssa", label: "NOM-021-SSA1-2021 (Promedio movil 8 horas)" },
    { value: "oms", label: "OMS (Promedio 24 horas)" },
  ],
  O3: [
    {
      value: "semarnat",
      label: "NOM-172-SEMARNAT-2023 (Promedio movil 8 horas)",
    },
    { value: "ssa", label: "NOM-020-SSA1-2021 (Promedio movil 8 horas)" },
    { value: "oms", label: "OMS (Promedio 8 horas)" },
  ],
  NO2: [
    {
      value: "semarnat",
      label: "NOM-172-SEMARNAT-2023 (Concentracion promedio horaria)",
    },
    {
      value: "ssa",
      label: "NOM-023-SSA1-2021 (Concentracion promedio horaria)",
    },
    { value: "oms", label: "OMS (Promedio 24 horas)" },
  ],
  SO2: [
    {
      value: "semarnat",
      label: "NOM-172-SEMARNAT-2023 (Concentracion promedio movil de 24 horas)",
    },
    {
      value: "ssa",
      label: "NOM-022-SSA1-2021 (Concentracion promedio horaria)",
    },
    { value: "oms", label: "OMS (Promedio 24 horas)" },
  ],
};

export const idBlacklist = [
  "P36757",
  "P47305",
  "P39499",
  "P46239",
  "P50855",
  "P35099",
  "P39709",
  "P39497",
  "P39285",
  "P39355",
  "P71091",
  "P49563",
  "P49949",
  "P50873",
];
export const idBlacklistpriv = ["P39497", "P39285"];
export const mapBlacklist = ["Sinaica"];

export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://aire.comiteecologicointegral.org/api"
    : "http://127.0.0.1:8000";

export const dateFormat = { weekday: "long", month: "short", day: "numeric", year: "numeric" };

