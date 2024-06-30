import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import Select from "react-select";
import { normOptions } from "../../../constants";

function CalendarForm({
  contaminant,
  avgType,
  setAvgType,
}) {
  const [avgOptions, setAvgOptions] = useState(null);

  useEffect(() => {
    if (!contaminant) return;
    setAvgType(normOptions[contaminant.value][0]);
    setAvgOptions(normOptions[contaminant.value]);
  }, [contaminant]);

  return (
    <Form className="mb-3">
      <Form.Group className="mb-3 d-flex justify-content-evenly">
        <Col xs={6}>
          <p className="font-weight-bold mb-2">Promedio/Índice</p>
          <Select
            options={avgOptions}
            placeholder={"Promedio de 24 horas"}
            value={avgType}
            onChange={(e) => setAvgType(e)}
          />
        </Col>
      </Form.Group>
    </Form>
  );
}

export default CalendarForm;
