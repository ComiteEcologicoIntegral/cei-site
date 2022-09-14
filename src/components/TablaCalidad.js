import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function TablaCalidad({gas}) {
    return(
        <Container className="t-center mb-5 mt-4" style={{width: "80%", border: "1px solid white", fontSize: "0.8rem"}}>
            <h3>Indice de calidad {gas}</h3>
            <Row className="ta-center font-weight-bold" style={{border: "1px solid white", borderTopRightRadius: "12px", borderTopLeftRadius: "12px"}}>
                <Col style={{}}><p>Contaminante</p></Col>
                <Col ><p>Promedio</p></Col>
                <Col style={{backgroundColor: "#00cc03"}}><p>Buena</p></Col>
                <Col style={{backgroundColor: "#ffff00"}}><p>Aceptable</p></Col>
                <Col style={{backgroundColor: "#fe6601"}}><p>Mala</p></Col>
                <Col style={{backgroundColor: "#fc0204"}}><p>Muy mala</p></Col>
                <Col className="text-white" style={{backgroundColor: "#640132", borderTopRightRadius: "12px"}}><p>Extremadamente mala</p></Col>
            </Row>
            {gas === "PM25" && (
                <Row className="ta-center" style={{border: "1px solid white", borderBottomLeftRadius:"12px", borderBottomRightRadius: "12px"}}>
                    <Col>PM2.5 μg/m3</Col>
                    <Col>Promedio ponderado 12 horas</Col>
                    <Col style={{backgroundColor: "#00cc03"}}>0-25</Col>
                    <Col style={{backgroundColor: "#ffff00"}}>25-41</Col>
                    <Col style={{backgroundColor: "#fe6601"}}>41-79</Col>
                    <Col style={{backgroundColor: "#fc0204"}}>79-147</Col>
                    <Col className="text-white" style={{backgroundColor: "#640132", borderBottomRightRadius: "12px"}}>{'>'}147</Col>
                </Row>
            )}
            {gas === "PM10" && (
                <Row className="ta-center" style={{border: "1px solid white", borderBottomLeftRadius:"12px", borderBottomRightRadius: "12px"}}>
                    <Col>PM10 μg/m3</Col>
                    <Col>Promedio móvil ponderado 12 horas</Col>
                    <Col style={{backgroundColor: "#00cc03"}}>0-50</Col>
                    <Col style={{backgroundColor: "#ffff00"}}>50-70</Col>
                    <Col style={{backgroundColor: "#fe6601"}}>155-235</Col>
                    <Col style={{backgroundColor: "#fc0204"}}>70-155</Col>
                    <Col className="text-white" style={{backgroundColor: "#640132"}}>{'>'}235</Col>
                </Row>
            )}
            {gas === "O3" && (
                <Row className="ta-center" style={{ border: "1px solid white", borderBottomLeftRadius:"12px", borderBottomRightRadius: "12px"}}>
                    <Col>Ozono ppm</Col>
                    <Col>Promedio 8 horas</Col>
                    <Col style={{backgroundColor: "#00cc03"}}>0-0.051</Col>
                    <Col style={{backgroundColor: "#ffff00"}}>0.051-0.065</Col>
                    <Col style={{backgroundColor: "#fe6601"}}>0.092-0.114</Col>
                    <Col style={{backgroundColor: "#fc0204"}}>0.065-0.092</Col>
                    <Col className="text-white" style={{backgroundColor: "#640132", borderBottomRightRadius: "12px"}}>{'>'}0.114</Col>
                </Row>)}
            {gas === "CO" && (
                <Row className="ta-center" style={{border: "1px solid white", borderBottomLeftRadius:"12px", borderBottomRightRadius: "12px"}}>
                    <Col>CO ppm</Col>
                    <Col>Promedio 8 horas</Col>
                    <Col style={{backgroundColor: "#00cc03"}}>0-8.75</Col>
                    <Col style={{backgroundColor: "#ffff00"}}>8.75-9</Col>
                    <Col style={{backgroundColor: "#fe6601"}}>13.3-15.5</Col>
                    <Col style={{backgroundColor: "#fc0204"}}>9-13.3</Col>
                    <Col className="text-white" style={{backgroundColor: "#640132", borderBottomRightRadius: "12px"}}>{'>'}15.5</Col>
                </Row>
            )}
            {gas === "NO2" && (
                <Row className="ta-center" style={{border: "1px solid white", borderBottomLeftRadius:"12px", borderBottomRightRadius: "12px"}}>
                    <Col>NO2 ppm</Col>
                    <Col>Concentración promedio 1 hora</Col>
                    <Col style={{backgroundColor: "#00cc03"}}>0-0.103</Col>
                    <Col style={{backgroundColor: "#ffff00"}}>0.103-0.106</Col>
                    <Col style={{backgroundColor: "#fe6601"}}>0.23-0.25</Col>
                    <Col style={{backgroundColor: "#fc0204"}}>0.106-0.23</Col>
                    <Col className="text-white" style={{backgroundColor: "#640132", borderBottomRightRadius: "12px"}}>{'>'}0.25</Col>
                </Row>
            )}
            {gas === "SO2" && (
                <Row className="ta-center" style={{border: "1px solid white", borderBottomLeftRadius:"12px", borderBottomRightRadius: "12px"}}>
                    <Col>SO2 ppm</Col>
                    <Col>Promedio 24 horas</Col>
                    <Col style={{backgroundColor: "#00cc03"}}>0-0.015</Col>
                    <Col style={{backgroundColor: "#ffff00"}}>0.015-0.04</Col>
                    <Col style={{backgroundColor: "#fe6601"}}>0.165-0.22</Col>
                    <Col style={{backgroundColor: "#fc0204"}}>0.04-0.165</Col>
                    <Col className="text-white" style={{backgroundColor: "#640132", borderBottomRightRadius: "12px"}}>{'>'}0.22</Col>
                </Row>
            )}  
            
            {/* <Row  style={{border: "1px solid black"}}>
                <Col>SO2 ppm</Col>
                <Col>Concentración promedio 1 hora</Col>
                <Col style={{backgroundColor: "#00cc03"}}></Col>
                <Col style={{backgroundColor: "#ffff00"}}></Col>
                <Col style={{backgroundColor: "#fe6601"}}></Col>
                <Col style={{backgroundColor: "#fc0204"}}>0.075</Col>
                <Col className="text-white" style={{backgroundColor: "#640132"}}></Col>
            </Row>
            <Row style={{border: "1px solid black", borderBottomRightRadius: "12px", borderBottomLeftRadius: "12px"}}>
                <Col>Ozono ppm</Col>
                <Col>Concentración promedio 1 hora</Col>
                <Col style={{backgroundColor: "#00cc03"}}></Col>
                <Col style={{backgroundColor: "#ffff00"}}></Col>
                <Col style={{backgroundColor: "#fe6601"}}></Col>
                <Col style={{backgroundColor: "#fc0204"}}>0.09</Col>
                <Col className="text-white" style={{backgroundColor: "#640132"}}></Col>
            </Row> */}
        </Container>
    )
}

export {TablaCalidad}
