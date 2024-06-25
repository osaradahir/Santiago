import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/CustomNavbar';
import { Link, useLocation } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import {host} from '../../conexion';

function UserUpdate() {
    /* The code snippet you provided is a React functional component named `UserUpdate`. Let's break
    down the code block: */
    const [newUser, setNewUser] = useState({
        area: '',
        nombre: '',
        contrasena: '',
        estado: '1',
        permisos: '1'
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userID = searchParams.get('id_usuario');

/* The `useEffect` hook in the provided code snippet is responsible for fetching and updating the user
data based on the `userID` parameter. Here's a breakdown of what it does: */

    useEffect(() => {
        if (userID) {
            fetch(`${host}usuario/${userID}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Datos del usuario:', data);
                    const userData = data[0];
                    setNewUser({
                        area: userData.area,
                        nombre: userData.nombre,
                        contrasena: '',
                        estado: userData.estado,
                        permisos: userData.permisos
                    });
                })
                .catch(error => console.error('Error al obtener los datos del usuario:', error));
        }
    }, [userID]);
    

    console.log('Nuevo usuario:', newUser);

    /**
    The function `handleInputChange` is used to update the `newUser` object with the new value based
    on the input field name.
    @param e - The parameter `e` in the `handleInputChange` function is an event object that is
    passed to the function when an input field's value changes. It contains information about the
    event that occurred, such as the target element that triggered the event (in this case, an input
    field), the type of
     */

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

   /**
   The handleSubmit function is an asynchronous function that sends a PUT request to update user
   data, handles the response, and redirects to the '/usuarios' page upon success or logs an error
   if there is a problem.
   @param e - The `e` parameter in the `handleSubmit` function is an event object that represents
   the event triggered by the form submission. In this case, it is used to prevent the default form
   submission behavior using `e.preventDefault()`. This prevents the page from reloading when the
   form is submitted, allowing the asynchronous
    */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${host}usuario/editar/${userID}`, {
                method: 'PUT',
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
            alert('El usuario se actualizo correctamente.');

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };    


    /* The above code is a JSX snippet for a form component in a React application. It is rendering a
    form for editing user information. The form includes input fields for selecting an area,
    entering a name, setting a password, choosing the user's status (active or inactive), and
    assigning permissions (administrator, director of transparency, or director of an area). The
    form also includes buttons for canceling the edit and saving the changes. The form submission is
    handled by a function called `handleSubmit`, and input changes are handled by the
    `handleInputChange` function. */
    return (
        <div className="app">
            <CustomNavbar />

            <div className="d-flex  align-items-center justify-content-center text-center">
                <h1 className="fs-1">Edita a tu usuario Usuario</h1>
            </div>

            <form onSubmit={handleSubmit} style={{marginTop: "10px"}}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    {/* Otros campos de entrada */}
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
                            <option value="2">Director de Area</option>
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

export default UserUpdate;
