import React, { useState } from 'react';
import { FaListCheck } from "react-icons/fa6";
import { TiFeather } from "react-icons/ti";
import { FaSmog } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { MdHome } from "react-icons/md";
import { IoIosHelpCircle } from "react-icons/io";
import { FaCalendar } from "react-icons/fa";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { FaMapMarkedAlt } from "react-icons/fa";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./Header.css";
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const NavIcon = ({ Icon }) => {
    return (<Icon className="m-2" />)
}

const CEILogo = ({ height }) => {
    return (
        <img
            src="/logo.jpg"
            height={height}
            alt="React Bootstrap logo"
            className="cei-logo"
        />
    );
}


const Header = () => {
    const [expanded, setExpanded] = useState(false);
    const closeOffcanvas = () => setExpanded(false)
    const CustomNavLink = ({ to, icon, text }) => {
        return (
            <Nav.Link as={NavLink} to={to} className="custom-nav-link" onClick={closeOffcanvas}>
                <NavIcon Icon={icon} />
                {text}
            </Nav.Link>
        );
    }
    const CustomNavItem = ({ to, icon, text }) =>
        <NavDropdown.Item as={NavLink} to={to} onClick={closeOffcanvas}>
            <NavIcon Icon={icon} />
            {text}
        </NavDropdown.Item>

    return (
        <Navbar className="my-navbar" data-bs-theme="dark" expand="lg" expanded={expanded} onToggle={setExpanded}>
            <Container>
                <Navbar.Brand >
                    <TiFeather />
                    CEI
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Offcanvas
                    id="basic-navbar-nav"
                    aria-labelledby="basic-navbar-label-nav"
                    placement="end"
                >
                    <Offcanvas.Header closeButton className="offcanvas-header">
                        <Offcanvas.Title id="basic-navbar-label-nav">
                            <CEILogo height="90" />
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="me-auto">
                            <CustomNavLink
                                to="/"
                                text="Inicio"
                                icon={MdHome}
                            />
                            <CustomNavLink
                                to="/mapa"
                                text="Mapa"
                                icon={FaMapMarkedAlt}
                            />
                            <div className="d-flex  align-items-center">

                                <NavDropdown title={<div className="d-inline-flex align-items-center"><NavIcon Icon={BiSolidSpreadsheet} /> Registro</div>} id="basic-nav-dropdown">
                                    <CustomNavItem
                                        to="/historico"
                                        text="Historico"
                                        icon={BsFillFileEarmarkSpreadsheetFill}
                                    />
                                    <CustomNavItem
                                        to="/calendario"
                                        text="Calendario"
                                        icon={FaCalendar}
                                    />
                                </NavDropdown>
                            </div>
                            <NavDropdown title={<div className="d-inline-flex align-items-center"><NavIcon Icon={IoIosHelpCircle} /> Ayuda</div>} id="basic-nav-dropdown">

                                <CustomNavItem
                                    to="/conceptos"
                                    text="Contaminantes"
                                    icon={FaSmog}
                                />
                                <CustomNavItem
                                    to="/recomendaciones"
                                    text="Recomendaciones"
                                    icon={FaListCheck}
                                />
                            </NavDropdown>
                            <Nav.Link as={NavLink} to="https://comiteecologicointegral.org/">
                                <NavIcon Icon={RiTeamFill} />
                                Conócenos
                            </Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar >
    );
};

export default Header;
