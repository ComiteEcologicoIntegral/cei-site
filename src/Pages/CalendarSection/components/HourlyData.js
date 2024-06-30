import React from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import { AiFillRightSquare } from 'react-icons/ai';

const HourlyData = ({ dayData, dataByHour, unidad, contaminant }) => {
  return (
    <Container className="mt-4">
      <p><strong>Promedio del día: </strong><Badge className={dayData?.status}>{dayData?.average?.toFixed(2)} {unidad[contaminant?.value]}</Badge></p>
      <div className="table-responsive">
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
            {dataByHour && dataByHour.slice(0, 12).map((hourData, currHour) => (
              <tr key={currHour}>
                <td>{currHour.toString().padStart(2, '0')}:00</td>
                <td>
                  <AiFillRightSquare style={{ color: "white" }} className={hourData.status} />
                  {hourData.value !== -1 && hourData.value
                    ? ` ${hourData.value} ${unidad[contaminant?.value]}`
                    : <small style={{ color: "red" }}>No hay registro</small>}
                </td>
                {dataByHour[currHour + 12] && (
                  <>
                    <td>{(currHour + 12).toString().padStart(2, '0')}:00</td>
                    <td>
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

export default HourlyData;
