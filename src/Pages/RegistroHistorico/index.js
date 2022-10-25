import React, { useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import Graph from "./components/Graph"
import Calendar from "./components/Calendar"
import "./index.css";

export default function Index() {
  const options = [
    { name: "Grafica", value: "1" },
    { name: "Calendario", value: "2" },
  ];
  const [selected, setSelected] = useState(options[0].value);

  return (
    <div className="historical-record container mb-10">
      <div className="mt-5">
        <div className="ta-center mb-5">
          <h2>Registro Histórico</h2>
          <p>Consulta los datos históricos de la calidad del aire</p>
        </div>
        <ButtonGroup toggle style={{ width: "100%" }}>
          {options.map((option, idx) => (
            <ToggleButton
              className="toggle-vista"
              key={idx}
              type="radio"
              variant="light"
              name="radio"
              value={option.value}
              checked={selected === option.value}
              onChange={(e) => setSelected(e.currentTarget.value)}
            >
              {option.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      {selected === "1" ? <Graph /> : <Calendar />}
    </div>
  );
}
