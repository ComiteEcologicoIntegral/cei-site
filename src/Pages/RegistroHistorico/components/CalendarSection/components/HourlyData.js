import React from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import { AiFillRightSquare } from 'react-icons/ai';
import { dateFormat } from '../../../../../constants';
import { capitalizeFirstLetter } from '../../../../../utils/stringUtils';

const HourlyData = ({ dayData, selectedDate, dataByHour, unidad, contaminant }) => {
  return (
    <Container className="mt-4">
      <h2 className="mb-4">
        {capitalizeFirstLetter(selectedDate.toLocaleDateString("es-MX", dateFormat))}
      </h2>
      <p><strong>Promedio del día: </strong><Badge className={dayData?.status}>{dayData?.average?.toFixed(2)} {unidad[contaminant?.value]}</Badge></p>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="thead-dark">
            <tr>
              <th>Hora</th>
              <th>Concentración (µg/m³)</th>
              <th>Hora</th>
              <th>Concentración (µg/m³)</th>
            </tr>
          </thead>
          <tbody>
            {dataByHour && dataByHour.slice(0, 12).map((hourData, currHour) => (
              <tr key={currHour}>
                <td>{currHour.toString().padStart(2, '0')}:00</td>
                <td>
                  <AiFillRightSquare style={{ color: "white" }} className={hourData.status} />
                  {hourData.value !== -1
                    ? ` ${hourData.value} ${unidad[contaminant?.value]}`
                    : " No hay registro"}
                </td>
                {dataByHour[currHour + 12] && (
                  <>
                    <td>{(currHour + 12).toString().padStart(2, '0')}:00</td>
                    <td>
                      <AiFillRightSquare style={{ color: "white" }} className={dataByHour[currHour + 12].status} />
                      {dataByHour[currHour + 12].value !== -1
                        ? ` ${dataByHour[currHour + 12].value || "ND"} ${unidad[contaminant?.value]}`
                        : " No hay registro"}
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

export default HourlyData;
