import React from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import MainForm from './MainForm';
import "./Header.css";

const Header = () => {
    return (
        <Navbar className="my-navbar" data-bs-theme="dark" expand="lg">
            <Navbar.Brand>
                <img
                    src="/logo.jpg"
                    className="d-inline-block align-top mr-2"
                    width="30"
                    height="30"
                    alt="React Bootstrap logo"
                /> CEI
            </Navbar.Brand>
            <small className="text-muted cei-name d-block">Comité Ecológico Integral</small>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <MainForm />
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/" className="menu-link">Mapa</Nav.Link>
                    <NavDropdown title="Registro" id="basic-nav-dropdown" className="menu-link">
                        <NavDropdown.Item as={NavLink} to="/historico">Historico</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/calendario">Calendario</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Ayuda" id="basic-nav-dropdown" className="menu-link">
                        <NavDropdown.Item as={NavLink} to="/conceptos">Contaminantes</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/recomendaciones">Recomendaciones</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={NavLink} to="/conocenos" className="menu-link">Conócenos</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
