/**
 * HourlyData.js
 *
 * This file defines the HourlyData component, which displays a responsive table
 * of hourly air quality measurements for a selected day and pollutant.
 *
 * Features:
 * - Shows daily average pollutant value with status indicator
 * - Visualizes hourly pollutant concentrations with color-coded status icons
 * - Handles missing data with clear warnings
 * - Responsive table layout for improved readability
 *
 * Dependencies:
 * - React (hooks, components)
 * - React-Bootstrap (UI layout and table components)
 * - react-icons (status icons)
 *
 * Last updated: [?]
 */

// React and third party libraries
import React from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import { AiFillRightSquare } from 'react-icons/ai';

/**
 * HourlyData
 * Displays a table of hourly pollutant concentrations and the daily average, with status indicators.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.dayData - Data for the selected day, including average and status.
 * @param {Array} props.dataByHour - Array of hourly data objects, each with value and status.
 * @param {Object} props.unidad - Object mapping contaminant keys to their units.
 * @param {Object} props.contaminant - The selected contaminant, with a 'value' property for lookup.
 * 
 * Renders a responsive table showing pollutant concentrations for each hour of the day,
 * with color-coded status icons and units. If data is missing for an hour, displays a warning message.
 */

// HourlyData component: renders the hourly data table and daily average
const HourlyData = ({ dayData, dataByHour, unidad, contaminant }) => {
  // Render: container for the table and daily average badge
  return (
    <Container className="mt-4">
      /* Daily average badge with status */
      <p><strong>Promedio del día: </strong><Badge className={dayData?.status}>{dayData?.average?.toFixed(2)} {unidad[contaminant?.value]}</Badge></p>
      <div className="table-responsive">
        /* Table of hourly data */
        <Table striped bordered hover size="sm">
          <thead className="thead-dark">
            <tr>
              <th>Hora</th>
              <th>Concentración (µg/m³)</th>
              <th>Hora</th>
              <th>Concentración (µg/m³)</th>
            </tr>
          </thead>
          <tbody>
            /* Render each row for 2 hours (0-11 and 12-23) */
            {dataByHour && dataByHour.slice(0, 12).map((hourData, currHour) => (
              <tr key={currHour}>
                /* First column: hour 0-11 */
                <td>{currHour.toString().padStart(2, '0')}:00</td>
                <td>
                  {/* Status icon and value for hour 0-11 */}
                  <AiFillRightSquare style={{ color: "white" }} className={hourData.status} />
                  {hourData.value !== -1 && hourData.value
                    ? ` ${hourData.value} ${unidad[contaminant?.value]}`
                    : <small style={{ color: "red" }}>No hay registro</small>}
                </td>
                /* Second column: hour 12-23, if exists */
                {dataByHour[currHour + 12] && (
                  <>
                    <td>{(currHour + 12).toString().padStart(2, '0')}:00</td>
                    <td>
                      /* Status icon and value for hour 12-23 */
                      <AiFillRightSquare style={{ color: "white" }} className={dataByHour[currHour + 12].status} />
                      {dataByHour[currHour + 12].value !== -1 && dataByHour[currHour + 12].value
                        ? ` ${dataByHour[currHour + 12].value} ${unidad[contaminant?.value]}`
                        : <small style={{ color: "red" }}>No hay registro</small>}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

//Export the HourlyData component as the default export for use in other modules
export default HourlyData;
