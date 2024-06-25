import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import {host} from '../../conexion';

function MapaInsert() {
    const [newUbication, setNewUbication] = useState({
        lugar: '',
        latitud: '',
        longitud: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUbication({
            ...newUbication,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert latitud and longitud to numbers
        const latitud = parseFloat(newUbication.latitud);
        const longitud = parseFloat(newUbication.longitud);

        // Check if the coordinates are valid
        if (isNaN(latitud) || isNaN(longitud) || latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
            alert('La latitud debe estar entre -90 y 90 grados y la longitud entre -180 y 180 grados.');
            return;
        }

        try {
            const response = await fetch(`${host}ubicacion/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUbication)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewUbication({
                lugar: '',
                latitud: '',
                longitud: ''
            });
            window.location.href = '/pagina/mapa';
            alert('Ubicacion creada Correctamente.');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    }

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Ingresa una nueva Ubicacion</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="lugar"
                                name="lugar"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Lugar"
                                value={newUbication.lugar}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="latitud"
                                name="latitud"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Latitud"
                                value={newUbication.latitud}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="longitud"
                                name="longitud"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Longitud"
                                value={newUbication.longitud}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                        <Link to="/pagina/mapa" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>
            </div>
            
        </div>
    );
}

export default MapaInsert;
