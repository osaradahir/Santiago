import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {

    const handleLogout = () => {
        localStorage.clear();// Borra el token del almacenamiento local
        window.location.href = '/'; // Redirige al usuario a la página de inicio de sesión
    };

    return (
        <Navbar expand="lg" fixed="top">
            <Nav className="mr-auto" style={{ marginLeft: '20px'}}>
                <Nav.Link as={Link} to="/pagina/logo" style={{ fontSize: '1.5em', color:"#04703f", fontWeight: "bold" }}>Logo</Nav.Link>
                <Nav.Link as={Link} to="/pagina/carrusel" style={{ fontSize: '1.5em', color:"#04703f", fontWeight: "bold" }}>Carrucel</Nav.Link>
                <Nav.Link as={Link} to="/pagina/color" style={{ fontSize: '1.5em', color:"#04703f", fontWeight: "bold" }}>Colores</Nav.Link>
                <Nav.Link as={Link} to="/pagina/mapa" style={{ fontSize: '1.5em', color:"#04703f", fontWeight: "bold"}}>Mapa</Nav.Link>
                <Nav.Link as={Link} to="/pagina/contactos/funcionarios" style={{ fontSize: '1.5em', color:"#04703f", fontWeight: "bold"}}>Contacto Funcionarios</Nav.Link>
                <Nav.Link as={Link} to="/pagina/contactos/institucinal" style={{ fontSize: '1.5em', color:"#04703f", fontWeight: "bold"}}>Contacto Institucinal</Nav.Link>
                <Nav.Link as={Link} to="/pagina/expresidentes" style={{ fontSize: '1.5em', color:"#04703f", fontWeight: "bold"}}>Exprecidentes</Nav.Link>
            </Nav>
            <Nav className="ml-auto" style={{ marginRight: '10px'}}>
                <NavDropdown 
                    title={
                        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
                    } 
                    id="user-menu"
                    align={{ lg: 'end' }} // Usar align con un objeto para alinear a la derecha
                    className="custom-dropdown-menu"
                    style={{ marginRight: '30px' }}
                >
                    <NavDropdown.Item as={Link} to="/menu">Menu</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Salir</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
}

export default CustomNavbar;
