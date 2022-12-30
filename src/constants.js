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
    {value: "semarnat", label: "NOM-172-SEMARNAT-2019 (Promedio movil 12 horas)"},
    {value: "ssa", label: "NOM-025-SSA1-2021 (Promedio movil 24 horas)"},
    {value: "oms", label: "OMS (Promedio 24 horas)"}
  ],
  PM10: [
    {value: "semarnat", label: "NOM-172-SEMARNAT-2019 (Promedio movil 12 horas)"},
    {value: "ssa", label: "NOM-025-SSA1-2021 (Promedio movil 24 horas)"},
    {value: "oms", label: "OMS (Promedio 24 horas)"}
  ],
  CO: [
    {value: "semarnat", label: "NOM-172-SEMARNAT-2019 (Promedio movil 8 horas)"},
    {value: "ssa", label: "NOM-021-SSA1-2021 (Promedio movil 8 horas)"},
    {value: "oms", label: "OMS (Promedio 24 horas)"}
  ],
  O3: [
    {value: "semarnat", label: "NOM-172-SEMARNAT-2019 (Promedio movil 8 horas)"},
    {value: "ssa", label: "NOM-020-SSA1-2021 (Promedio movil 8 horas)"},
    {value: "oms", label: "OMS (Promedio 8 horas)"}
  ],
  NO2: [
    {value: "semarnat", label: "NOM-172-SEMARNAT-2019 (Concentracion promedio horaria)"},
    {value: "ssa", label: "NOM-023-SSA1-2021 (Concentracion promedio horaria)"},
    {value: "oms", label: "OMS (Promedio 24 horas)"}
  ],
  SO2: [
    {value: "semarnat", label: "NOM-172-SEMARNAT-2019 (Concentracion promedio movil de 24 horas)"},
    {value: "ssa", label: "NOM-022-SSA1-2021 (Concentracion promedio horaria)"},
    {value: "oms", label: "OMS (Promedio 24 horas)"}
  ],
}

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
    ? process.env.REACT_APP_API_URL
    : "http://127.0.0.1:8000";
