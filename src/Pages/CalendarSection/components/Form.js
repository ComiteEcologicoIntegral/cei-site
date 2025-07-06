/**
 * Form.js
 *
 * This file defines the CalendarForm component, which renders a form for selecting
 * the average type or index for air quality data visualization in the calendar view.
 *
 * Features:
 * - Dynamically updates available average/index options based on the selected contaminant
 * - Uses react-select for a modern dropdown UI
 * - Integrates with React-Bootstrap for layout and styling
 *
 * Dependencies:
 * - React (hooks, components)
 * - React-Bootstrap (Form, Col)
 * - react-select (dropdown component)
 * - normOptions from constants
 *
 * Last updated: [?]
 */

// React and third party libraries
import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import Select from "react-select";
import { normOptions } from "../../../constants";

/**
 * CalendarForm Component
 * Renders a form for selecting the average type or index for air quality data visualization.
 *
 * Uses:
 * - React state: avgOptions
 * - Hooks: useState, useEffect
 * - Child components: Form, Col, Select (react-select)
 *
 * @param {Object} props - The component props.
 * @param {Object} props.contaminant - The selected contaminant, used to determine available options.
 * @param {Object} props.avgType - The currently selected average type or index.
 * @param {Function} props.setAvgType - Function to update the selected average type or index.
 *
 * @returns {JSX.Element} The rendered CalendarForm component.
 */
function CalendarForm({
  contaminant,
  avgType,
  setAvgType,
}) {
  const [avgOptions, setAvgOptions] = useState(null);

  /**
   * Updates the available average/index options and sets the default selection
   * whenever the contaminant changes.
   *
   * - If no contaminant is selected, does nothing.
   * - Otherwise, sets the selected average type to the first available option for the contaminant.
   * - Updates the dropdown options to match the selected contaminant.
   */
  useEffect(() => {
    if (!contaminant) return;
    setAvgType(normOptions[contaminant.value][0]);
    setAvgOptions(normOptions[contaminant.value]);
  }, [contaminant]);

  /**
   * Renders a form with a dropdown menu that lets the user select the average type or index for air quality 
   * data. The dropdown options update based on the selected contaminant, and the selected value is managed 
   * by the component's state. The form uses React-Bootstrap for layout and react-select for the dropdown UI.
   */
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
