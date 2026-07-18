import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { criteria } from "../constants";

const qualityGasData = {
  PM25: {
    Title: "PM2.5 μg/m3",
    AverageDetails: "Promedio ponderado de 12 horas",
  },
  PM10: {
    Title: "PM10 μg/m3",
    AverageDetails: "Promedio móvil ponderado de 12 horas",
  },
  O3: {
    Title: "Ozono ppm",
    AverageDetails: "Promedio horario",
  },
  CO: {
    Title: "Monóxido de carbono ppm",
    AverageDetails: "Promedio móvil de 8 horas",
  },
  NO2: {
    Title: "Dióxido de nitrógeno ppm",
    AverageDetails: "Promedio horario",
  },
  SO2: {
    Title: "Dióxido de azufre ppm",
    AverageDetails: "Promedio horario",
  },
};

const fmt3digits = {
  format: (el) => {return el.toFixed(3)}
}

const fmt2digits =  {
  format: (el) => {return el.toFixed(2)}
}
const fmt0digits = {
  format: (el) => {return el.toFixed(0)}
}

const numFormats = {
  PM10: fmt0digits,
  PM25: fmt0digits,
  O3: fmt3digits,
  NO2: fmt3digits,
  SO2: fmt3digits,
  CO: fmt2digits,
}

function TablaCalidad({ gas }) {
  const selectedGas = qualityGasData[gas] || {};
  const numfmt = numFormats[gas]


  if (!numfmt) {
    return;
  }
  const limits = criteria["semarnat"][gas].map(el => numfmt.format(el)) || {};
  // const limits = criteria["semarnat"][gas]|| {};

  return (
    <div className="d-flex justify-content-center align-items-center px-0">
      <Container fluid style={{ fontSize: "0.9rem", maxWidth: "100vw" }}>
        <h5 className="mt-3 text-center">Índice de calidad</h5>
        <p className="text-center w-100">
          {" "}
          {selectedGas.Title} - {selectedGas.AverageDetails}
        </p>
        <div
          className="table-responsive"
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "12px",
            border: "1px solid #dee2e6",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <table
            className="text-center mb-0"
            style={{
              minWidth: "500px",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#00cc03", color: "#fff" }}>
                  Buena
                </th>
                <th style={{ backgroundColor: "#ffff00", color: "#000" }}>
                  Aceptable
                </th>
                <th style={{ backgroundColor: "#fe6601", color: "#fff" }}>
                  Mala
                </th>
                <th style={{ backgroundColor: "#fc0204", color: "#fff" }}>
                  Muy mala
                </th>
                <th
                  style={{
                    backgroundColor: "#640132",
                    color: "#fff",
                    borderTopRightRadius: "12px",
                  }}
                >
                  Extremadamente mala
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ backgroundColor: "#00cc03", color: "#fff" }}>
                  &le;{`${limits[0]}`}
                </td>
                <td
                  style={{ backgroundColor: "#ffff00", color: "#000" }}
                >{`>${limits[0]} a ${limits[1]}`}</td>
                <td
                  style={{ backgroundColor: "#fe6601", color: "#fff" }}
                >{`>${limits[1]} a ${limits[2]}`}</td>
                <td
                  style={{ backgroundColor: "#fc0204", color: "#fff" }}
                >{`>${limits[2]} a ${limits[3]}`}</td>
                <td
                  style={{
                    backgroundColor: "#640132",
                    color: "#fff",
                    borderBottomRightRadius: "12px",
                  }}
                >{`> ${limits[3]}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

export { TablaCalidad };
