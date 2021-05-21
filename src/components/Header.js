import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useState } from 'react'

const Header = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Navbar variant="dark" expand="lg" expanded={expanded}>
            <Navbar.Brand>
                <NavLink to="/">
                    <img
                        src="/logo.jpg"
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </NavLink>
            </Navbar.Brand>
            <Navbar.Text>
                <h1 className="white h1-nav mb-0">Comité Ecológico Integral (Beta)</h1>
            </Navbar.Text>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                <NavLink  onClick={() => setExpanded(false)} activeClassName="nav-active" className="menu-link" exact to="/">Mapa</NavLink>
                <NavLink  onClick={() => setExpanded(false)} activeClassName="nav-active" className="menu-link" to="/registro">Registro histórico</NavLink>
                <NavLink  onClick={() => setExpanded(false)} activeClassName="nav-active" className="menu-link" to="/compara">Compara datos</NavLink>
                <NavLink  onClick={() => setExpanded(false)} activeClassName="nav-active" className="menu-link" to="/">Acerca de</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
