import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function SeccionUpdate() {
    const [seccion, setSeccion] = useState({
        nombre_seccion: ''
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const seccionID = searchParams.get('id_seccion');

    useEffect(() => {
        if (seccionID) {
            fetch(`${host}seccion/${seccionID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se encontraron datos de la sección');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.nombre_seccion) {
                        setSeccion({
                            nombre_seccion: data.nombre_seccion
                        });
                    } else {
                        throw new Error('No se encontraron datos de la sección');
                    }
                })
                .catch(error => console.error('Error al obtener los datos:', error));
        }
    }, [seccionID]);

    const handleInputChange = (event) => {
        setSeccion({
            ...seccion,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${host}seccion/editar/${seccionID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(seccion),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar la sección');
            }
            return response.json();
        })
        .then(data => {
            console.log('Sección actualizada:', data);
            alert('Sección actualizada correctamente');
            window.location.href = '/conac/seccion';
        })
        .catch(error => console.error(error.message));
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Actualiza la Sección</h1>
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
                                value={seccion.nombre_seccion}
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

export default SeccionUpdate;
