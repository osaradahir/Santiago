import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function UserInsert() {
    const [newUser, setNewUser] = useState({
        area: '',
        nombre: '',
        contrasena: '',
        estado: '1', // Establecer valor por defecto para estado
        permisos: '1' // Establecer valor por defecto para permisos (anteriormente rol)
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

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
            // Limpiar el formulario después de enviar los datos
            setNewUser({
                area: '',
                nombre: '',
                contrasena: '',
                estado: '1',
                permisos: '1'
            });
            window.location.href = '/usuarios';
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex  align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa un nuevo Usuario</h1>
            </div>

            <form onSubmit={handleSubmit} style={{marginTop: "10px"}}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    {/* Otros campos de entrada */}
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="area"
                            name="area"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Área"
                            value={newUser.area}
                            onChange={handleInputChange}
                            required
                        />
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
