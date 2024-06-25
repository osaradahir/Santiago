import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function UserInsert() {
    /* The code snippet `const [newUser, setNewUser] = useState({ area: '', nombre: '', contrasena: '',
    estado: '1', permisos: '1' });` is initializing a state variable named `newUser` using the
    `useState` hook in a React functional component. */
    const [newUser, setNewUser] = useState({
        area: '',
        nombre: '',
        contrasena: '',
        estado: '1',
        permisos: '1'
    });

    /**
     * The handleInputChange function updates the state of a newUser object with the new value based on
     * the input field name.
     * @param e - The parameter `e` in the `handleInputChange` function is an event object that is
     * passed to the function when an input field's value changes. It contains information about the
     * event that occurred, such as the target element that triggered the event (in this case, an input
     * field), the type of
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    /**
     * The handleSubmit function is an asynchronous function that sends a POST request to create a new
     * user, handles the response, clears the form, and redirects to the users page with an alert
     * message.
     * @param e - In the `handleSubmit` function you provided, the parameter `e` is an event object
     * that represents the event being handled, which in this case is a form submission event. By
     * calling `e.preventDefault()`, you are preventing the default behavior of the form submission,
     * allowing you to handle the form data
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${host}usuario/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewUser({
                area: '',
                nombre: '',
                contrasena: '',
                estado: '1',
                permisos: '1'
            });
            window.location.href = '/usuarios';
            alert('Usuario creado correctamente');

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

/* The code snippet you provided is a React functional component named `UserInsert`. Within this
component, the `return` statement is responsible for rendering the JSX (JavaScript XML) elements
that make up the user interface for creating a new user. Here's a breakdown of what the JSX elements
are doing: */

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex  align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa un nuevo Usuario</h1>
            </div>

            <form onSubmit={handleSubmit} style={{marginTop: "10px"}}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    {/* Campo de selección para el área */}
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="area"
                            name="area"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newUser.area}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Seleccione un área</option>
                            <option value="Transparencia">Transparencia</option>
                            <option value="Comunicación Social">Comunicación Social</option>
                            <option value="Obras Públicas">Obras Públicas</option>
                            <option value="Tesorería">Tesorería</option>
                            <option value="Secretaría Municipal">Secretaría Municipal</option>
                            <option value="Oficial Mayor">Oficial Mayor</option>
                            <option value="Contraloría">Contraloría</option>
                            <option value="Administracion">Administración</option>
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Nombre"
                            value={newUser.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Contraseña"
                            value={newUser.contrasena}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="estado"
                            name="estado"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newUser.estado}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="permisos"
                            name="permisos"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newUser.permisos}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="1">Administrador</option>
                            <option value="0">Director de Transparencia</option>
                            <option value="2">Director de Área</option>
                        </select>
                    </div>
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/usuarios" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default UserInsert;
