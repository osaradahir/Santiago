import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function FraccionUpdateConac() {
    const [fraccion, setFraccion] = useState({
        nombre_fraccion: ''
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const fraccionID = searchParams.get('id_fraccion');

    useEffect(() => {
        if (fraccionID) {
            fetch(`${host}fraccion-conac/${fraccionID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se encontraron datos de la fracción');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.nombre_fraccion) {
                        setFraccion({
                            nombre_fraccion: data.nombre_fraccion
                        });
                    } else {
                        throw new Error('No se encontraron datos de la fracción');
                    }
                })
                .catch(error => console.error('Error al obtener los datos:', error));
        }
    }, [fraccionID]);

    const handleInputChange = (event) => {
        setFraccion({
            ...fraccion,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${host}fraccion-conac/editar/${fraccionID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fraccion),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar la fracción');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fracción actualizada:', data);
            alert('Fracción actualizada correctamente');
            window.location.href = '/conac/fraccion';
        })
        .catch(error => console.error(error.message));
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Actualiza la Fracción</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="nombre_fraccion"
                                name="nombre_fraccion"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Nombre de la fracción"
                                value={fraccion.nombre_fraccion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                        <Link to="/conac/fraccion" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>
            </div>
        </div> 
    );
}

export default FraccionUpdateConac;
