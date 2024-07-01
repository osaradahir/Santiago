import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function SeccionInsert() {
    const [newSeccion, setNewSeccion] = useState({
        nombre_seccion: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSeccion({
            ...newSeccion,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${host}seccion/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSeccion)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewSeccion({
                nombre_seccion: ''
            });
            window.location.href = '/conac/seccion';
            alert('Sección creada correctamente');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Ingresa una nueva Sección</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="nombre_seccion"
                                name="nombre_seccion"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Nombre de la sección"
                                value={newSeccion.nombre_seccion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                        <Link to="/conac/seccion" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SeccionInsert;
