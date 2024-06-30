import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Plot from "react-plotly.js";

// TODO: Simplificar, dividir en sub componentes
function MyPlot({ plotData, summary, downloadCSV }) {
  const { data, layout } = plotData;

  return (
    <Row className="mb-5">
      <Col xs={12} lg={4} xl={2}>
        <Row className="d-flex justify-content-center">
          <Col xs={6} sm={5} lg={12}>
            <div className="dato-calculado">
              <p className="tipo text-center">Máximo</p>
              <p className="desc text-center">
                {summary && summary?.max.date ? `Registrado el ${summary?.max.date}` : ""}
              </p>
              <p className="numero muymala text-center">
                {summary && typeof summary?.max.value === "number"
                  ? summary.max.value.toFixed(2)
                  : "-"}
              </p>
            </div>
          </Col>
          <Col xs={6} sm={5} lg={12}>
            <div className="dato-calculado">
              <p className="tipo text-center">Mínimo</p>
              <p className="desc text-center">
                {summary && summary?.min.date ? `Registrado el ${summary?.min.date}` : ""}
              </p>
              <p className="numero acept text-center">
                {summary && typeof summary?.min.value === "number"
                  ? summary.min.value.toFixed(2)
                  : "-"}
              </p>
            </div>
          </Col>
          <Col xs={6} sm={5} lg={12}>
            <div className="dato-calculado">
              <p className="tipo text-center">Promedio</p>
              <p className="numero mala text-center">
                {summary && typeof summary?.avg.value === "number"
                  ? summary.avg.value.toFixed(3)
                  : "-"}
              </p>
            </div>
          </Col>
          <Col xs={6} sm={5} lg={12}>
            <div className="dato-calculado">
              <p className="tipo text-center">Arriba de la norma</p>
              <p
                className={`numero text-center ${summary
                  ? summary.porcentajes.arribaLimite === 0
                    ? "bueno"
                    : summary.porcentajes.arribaLimite > 25
                      ? "muymala"
                      : "mala"
                  : null
                  }`}
              >
                {summary ? summary.porcentajes.arribaLimite + "%" : "-"}
              </p>
            </div>
          </Col>
          <Col xs={12} sm={5} lg={12}>
            <Row className="dato-calculado">
              <Col
                xs={6}
                sm={6}
                className="d-flex flex-column align-items-center justify-content-center"
              >
                <p className="tipo text-center">Datos Válidos</p>
                <p className="numero bueno text-center">
                  {summary ? summary.porcentajes.buenos + "%" : "-"}
                </p>
              </Col>
              <Col
                xs={6}
                sm={6}
                className="d-flex flex-column align-items-center justify-content-center"
              >
                <p className="tipo text-center">Datos Nulos</p>
                <p className="numero muymala text-center">
                  {summary ? summary.porcentajes.nulos + "%" : "-"}
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Button
          variant="info"
          onClick={() => {
            downloadCSV();
          }}
        >
          Descargar datos en CSV
        </Button>
      </Col>
      <Col sm={12} lg={8} xl={10}>
        <Plot
          className="plot"
          data={data}
          layout={layout}
          config={{ responsive: true }}
        />
      </Col>
    </Row>
  );
}

export default MyPlot;
