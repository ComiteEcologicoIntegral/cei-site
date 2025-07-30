import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { criteria } from "../constants";

const qualityGasData = {
  PM25: {
    Title: "PM2.5 μg/m3",
    AverageDetails: "Promedio ponderado 12 horas",
  },
  PM10: {
    Title: "PM10 μg/m3",
    AverageDetails: "Promedio móvil ponderado 12 horas",
  },
  O3: {
    Title: "Ozono ppm",
    AverageDetails: "Promedio 8 horas",
  },
  CO: {
    Title: "PM2.5 μg/m3",
    AverageDetails: "Promedio ponderado 12 horas",
  },
  NO2: {
    Title: "NO2 ppm",
    AverageDetails: "Concentración promedio 1 hora",
  },
  SO2: {
    Title: "SO2 ppm",
    AverageDetails: "Promedio 24 horas",
  },
};

function TablaCalidad({ gas }) {
  const selectedGas = qualityGasData[gas] || {};
  const limits = criteria["ssa"][gas] || {};

  return (
    <div className="d-flex justify-content-center align-items-center px-0">
      <Container fluid style={{ fontSize: "0.9rem", maxWidth: "100vw" }}>
        <h5 className="mt-3 text-center">Índice de calidad</h5>
        <p className="text-center w-100"> {selectedGas.Title} - {selectedGas.AverageDetails}</p>
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
            style={{ minWidth: "500px", borderCollapse: "separate", borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#00cc03", color: "#fff" }}>Buena</th>
                <th style={{ backgroundColor: "#ffff00", color: "#000" }}>Aceptable</th>
                <th style={{ backgroundColor: "#fe6601", color: "#fff" }}>Mala</th>
                <th style={{ backgroundColor: "#fc0204", color: "#fff" }}>Muy mala</th>
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
                <td style={{ backgroundColor: "#00cc03", color: "#fff" }}>{`0 - ${limits[0]}`}</td>
                <td style={{ backgroundColor: "#ffff00", color: "#000" }}>{`${limits[0]} - ${limits[1]}`}</td>
                <td style={{ backgroundColor: "#fe6601", color: "#fff" }}>{`${limits[1]} - ${limits[2]}`}</td>
                <td style={{ backgroundColor: "#fc0204", color: "#fff" }}>{`${limits[2]} - ${limits[3]}`}</td>
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
