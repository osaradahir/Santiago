import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function TomoInsert() {
    const [newTomo, setNewTomo] = useState({
        nombre_tomo: '',
        descripcion: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTomo({
            ...newTomo,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${host}tomo/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTomo)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewTomo({
                nombre_tomo: '',
                descripcion: ''
            });
            window.location.href = '/conac/tomo';
            alert('Tomo creado correctamente');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Ingresa un nuevo Tomo</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="nombre_tomo"
                                name="nombre_tomo"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Nombre del tomo"
                                value={newTomo.nombre_tomo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Descripción"
                                value={newTomo.descripcion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                        <Link to="/conac/tomo" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
            
    );
}

export default TomoInsert;
