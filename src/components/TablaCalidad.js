import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const rangeFactory = (start, end) => {
  return {
    start: start,
    end: end,
  };
};

const rangeToString = (range) => `${range.start} - ${range.end}`;

const qualityGasData = {
  PM25: {
    Title: "PM2.5 μg/m3",
    AverageDetails: "Promedio ponderado 12 horas",
    Good: rangeFactory(0, 25),
    Acceptable: rangeFactory(25, 41),
    Bad: rangeFactory(41, 79),
    VeryBad: rangeFactory(79, 147),
    ExtremlyBad: 147,
  },
  PM10: {
    Title: "PM10 μg/m3",
    AverageDetails: "Promedio móvil ponderado 12 horas",
    Good: rangeFactory(0, 50),
    Acceptable: rangeFactory(50, 70),
    Bad: rangeFactory(70, 155),
    VeryBad: rangeFactory(155, 235),
    ExtremlyBad: 235,
  },
  O3: {
    Title: "Ozono ppm",
    AverageDetails: "Promedio 8 horas",
    Good: rangeFactory(0, 50),
    Acceptable: rangeFactory(50, 70),
    Bad: rangeFactory(70, 155),
    VeryBad: rangeFactory(155, 235),
    ExtremlyBad: 0.144,
  },
  CO: {
    Title: "PM2.5 μg/m3",
    AverageDetails: "Promedio ponderado 12 horas",
    Good: rangeFactory(0, 8.75),
    Acceptable: rangeFactory(8.75, 9),
    Bad: rangeFactory(9, 13.3),
    VeryBad: rangeFactory(13.3, 15.5),
    ExtremlyBad: 15.5,
  },
  NO2: {
    Title: "NO2 ppm",
    AverageDetails: "Concentración promedio 1 hora",
    Good: rangeFactory(0, 0.103),
    Acceptable: rangeFactory(0.103, 0.106),
    Bad: rangeFactory(0.106, 0.23),
    VeryBad: rangeFactory(0.23, 0.25),
    ExtremlyBad: 0.25,
  },
  SO2: {
    Title: "SO2 ppm",
    AverageDetails: "Promedio 24 horas",
    Good: rangeFactory(0, 0.015),
    Acceptable: rangeFactory(0.015, 0.04),
    Bad: rangeFactory(0.04, 0.165),
    VeryBad: rangeFactory(0.165, 0.22),
    ExtremlyBad: 0.22,
  },
};

function TablaCalidad({ gas }) {

  const selectedGas = qualityGasData[gas];

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
        <Col style={{ backgroundColor: "#00cc03" }}>{rangeToString(selectedGas.Good)}</Col>
        <Col style={{ backgroundColor: "#ffff00" }}>{rangeToString(selectedGas.Acceptable)}</Col>
        <Col style={{ backgroundColor: "#fe6601" }}>{rangeToString(selectedGas.Bad)}</Col>
        <Col style={{ backgroundColor: "#fc0204" }}>{rangeToString(selectedGas.VeryBad)}</Col>
        <Col
          className="text-white"
          style={{ backgroundColor: "#640132", borderBottomRightRadius: "12px" }}
        >{`> ${selectedGas.ExtremlyBad}`}</Col>
      </Row>
    </Container>
  );
}

export { TablaCalidad };
