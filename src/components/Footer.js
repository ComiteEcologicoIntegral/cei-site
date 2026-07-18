import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="py-4 mt-5">
            <Container>
                <Row className="text-center text-lg-start">
                    <Col lg={6} className="mb-3 mb-lg-0">
                        <h6 className="fw-bold text-uppercase">Fuentes de datos</h6>
                        <ul className="list-unstyled">
                            <li>
                                <a
                                    href="https://sinaica.inecc.gob.mx/"
                                    className="text-white text-decoration-underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Sinaica
                                </a>
                            </li>
                            <li>
                                <a
                                    href="http://aire.nl.gob.mx/"
                                    className="text-white text-decoration-underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Sima
                                </a>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={6} className="d-flex align-items-center justify-content-center justify-content-lg-end">
                        <p className="mb-0">
                            Proyecto solidario con el servicio social del <span className="fw-bold">TEC de Monterrey</span>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
