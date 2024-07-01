import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function TomoUpdate() {
    const [tomo, setTomo] = useState({
        nombre_tomo: '',
        descripcion: ''
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tomoID = searchParams.get('id_tomo');

    useEffect(() => {
        if (tomoID) {
            fetch(`${host}tomo/${tomoID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se encontraron datos del tomo');
                    }
                    return response.json();
                })
                .then(data => {
                    // Asegurémonos de que los datos están en el formato correcto
                    if (data && data.nombre_tomo && data.descripcion) {
                        setTomo({
                            nombre_tomo: data.nombre_tomo,
                            descripcion: data.descripcion
                        });
                    } else {
                        throw new Error('No se encontraron datos del tomo');
                    }
                })
                .catch(error => console.error('Error al obtener los datos:', error));
        }
    }, [tomoID]);

    const handleInputChange = (event) => {
        setTomo({
            ...tomo,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${host}tomo/editar/${tomoID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tomo),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el tomo');
            }
            return response.json();
        })
        .then(data => {
            console.log('Tomo actualizado:', data);
            alert('Tomo actualizado correctamente');
            window.location.href = '/conac/tomo';
        })
        .catch(error => console.error(error.message));
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Actualiza el Tomo</h1>
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
                                value={tomo.nombre_tomo}
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
                                value={tomo.descripcion}
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

export default TomoUpdate;
