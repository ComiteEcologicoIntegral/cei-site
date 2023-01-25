import "../../App.css";
import React, { useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";

function Prediccion() {
  const [system, setSystem] = useState(null);
  const [location, setLocation] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [title, setTitle] = useState(null);
  const fetchData = () => {
    setIsShown(true)
    setTitle(location.label)
  };
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
            Selecciona el sistema y ubicación
            </li>
            <li>
              Da click en generar predicción
            </li>
          </ol>
      </div>
      <Form
        system={system}
        location={location}
        setSystem={setSystem}
        setLocation={setLocation}
        search={fetchData}
      />
      <br></br>
      {isShown && <Table title={title} />}
      </div>
  );
}
export default Prediccion;