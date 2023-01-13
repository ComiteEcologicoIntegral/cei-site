import React from "react";
import "./App.css";

function Prediccion() {
    
  return (
    <div className="container mt-5">
      <div className="ta-center mb-5">
        <h2>Predicción</h2>
        <p>Consulta la predicción de la calidad del aire</p>
      </div>
      <hr className="mb-4" />
      <div>
        <p>Pasos para generar la predicción:</p>
        <ol>
          <li>
            Selecciona los filtros que deseas aplicar.
            </li>
          </ol>
      </div>
      <div class="tableDiv">
        <h3 class="stationName">Global - Estación</h3>
        <div id="table-wrapper">
        <div id="table-scroll">
        <table class="predictionTable">
          <thead>
            <tr>
              <th class="superTableSpace">HORARIO</th>
              <th>L</th>
              <th>M</th>
              <th>M</th>
              <th>J</th>
              <th>V</th>
              <th>S</th>
              <th>D</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="titleH">Madrugada 12:00 am - 6:00 am</th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
            </tr>
            <tr>
              <th class="titleH">Mañana 6:00 am - 12:00 pm</th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
            </tr>
            <tr>
              <th class="titleH">Tarde 12:00 pm - 6:00 pm</th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
            </tr>
            <tr>
              <th class="titleH" align="center">Tarde 6:00 pm - 12:00 am</th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#73022C" }}></th>
              <th style={{ backgroundColor: "#73022C" }}></th>
              <th style={{ backgroundColor: "#73022C" }}></th>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      </div>
    </div>
  );
}
export default Prediccion;