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
  const selectedGas = qualityGasData[gas];
  const limits = criteria["ssa"][gas];

  return (
    <Container
      className="t-center mb-5 mt-4"
      style={{ width: "80%", border: "1px solid white", fontSize: "0.8rem" }}
    >
      <h3>Indice de calidad {gas}</h3>
      <Row
        className="ta-center font-weight-bold"
        style={{
          border: "1px solid white",
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
      >
        <Col style={{}}>
          <p>Contaminante</p>
        </Col>
        <Col>
          <p>Promedio</p>
        </Col>
        <Col style={{ backgroundColor: "#00cc03" }}>
          <p>Buena</p>
        </Col>
        <Col style={{ backgroundColor: "#ffff00" }}>
          <p>Aceptable</p>
        </Col>
        <Col style={{ backgroundColor: "#fe6601" }}>
          <p>Mala</p>
        </Col>
        <Col style={{ backgroundColor: "#fc0204" }}>
          <p>Muy mala</p>
        </Col>
        <Col
          className="text-white"
          style={{ backgroundColor: "#640132", borderTopRightRadius: "12px" }}
        >
          <p>Extremadamente mala</p>
        </Col>
      </Row>
      <Row
        className="ta-center"
        style={{
          border: "1px solid white",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      >
        <Col>{selectedGas.Title}</Col>
        <Col>{selectedGas.AverageDetails}</Col>
        <Col style={{ backgroundColor: "#00cc03" }}>
          {`${limits[0]} - ${limits[1]}`}
        </Col>
        <Col style={{ backgroundColor: "#ffff00" }}>
          {`${limits[1]} - ${limits[2]}`}
        </Col>
        <Col style={{ backgroundColor: "#fe6601" }}>
          {`${limits[2]} - ${limits[3]}`}
        </Col>
        <Col style={{ backgroundColor: "#fc0204" }}>
          {`${limits[3]} - ${limits[4]}`}
        </Col>
        <Col
          className="text-white"
          style={{
            backgroundColor: "#640132",
            borderBottomRightRadius: "12px",
          }}
        >{`> ${limits[4]}`}</Col>
      </Row>
    </Container>
  );
}

export { TablaCalidad };
