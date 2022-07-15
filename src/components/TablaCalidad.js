import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function TablaCalidad() {
    return(
        <Container className="t-center mb-5 mt-4" style={{width: "80%", border: "1px solid white", fontSize: "0.8rem"}}>
            <Row className="ta-center font-weight-bold" style={{border: "1px solid white", backgroundColor: "#eaeaea", borderTopRightRadius: "12px", borderTopLeftRadius: "12px", padding: "12px"}}>
                <Col><p>Nivel</p></Col>
                <Col ><p>Valor numérico</p></Col>
                <Col><p>Significado</p></Col>
            </Row>
            <Row style={{border: "1px solid white", backgroundColor: "#00cc03", padding: "12px"}}>
                <Col>Bueno</Col>
                <Col>0 a 50</Col>
                <Col>La calidad del aire se considera satisfactoria y la contaminación del aire representa poco o ningun riesgo.</Col>
            </Row>
            <Row style={{border: "1px solid white", backgroundColor: "#ffff00", padding: "12px"}}>
                <Col>Moderada</Col>
                <Col>51 a 100</Col>
                <Col>La calidad del aire es aceptable, sin embargo, puede habar un problema de salur moderado para un número muy pequeño de personas que son excepcionalmente sensible a la contaminación del aire.</Col>
            </Row>
            <Row style={{border: "1px solid white", backgroundColor: "#fe6601", padding: "12px"}}>
                <Col>No saludable para grupos sensibles</Col>
                <Col>101 a 150</Col>
                <Col>Miembros de grupos sensibles pueden experimentar efectos de salud. El público en general no es probable que sea afectado.</Col>
            </Row>
            <Row className="text-white" style={{border: "1px solid white", backgroundColor: "#fc0204", padding: "12px"}}>
                <Col>Insalubre</Col>
                <Col>151 a 200</Col>
                <Col>Todo el mundo puede comenzar a experimentar efectos en la salud, los miembros de grupos sensibles pueden experimentar efectos de salud más graves.</Col>
            </Row>
            <Row className="text-white" style={{border: "1px solid white", backgroundColor: "#990134", padding: "12px"}}>
                <Col>Muy insalubre</Col>
                <Col>201 a 300</Col>
                <Col>Las advertencias sanitarias de las condiciones de emergencia. Toda la población tiene más probabilidades de ser afectados.</Col>
            </Row>
            <Row className="text-white" style={{border: "1px solid white", backgroundColor: "#640132", padding: "12px", borderBottomRightRadius: "12px", borderBottomLeftRadius: "12px"}}>
                <Col>Peligroso</Col>
                <Col>301 a 500</Col>
                <Col>Alerta de salud: todo el mundo puede experimentar efectos de salud más graves.</Col>
            </Row>
        </Container>
    )
}

export {TablaCalidad}