import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';

function MapaUpdate() {
    const [newUbication, setNewUbication] = useState({
        lugar: '',
        latitud: '',
        longitud: ''
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const avisoID = searchParams.get('id_aviso');

    useEffect(() => {
        if (avisoID) {
            fetch(`http://localhost:8000/ubicacion/${avisoID}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const ubicationData = data[0]; // Tomamos el primer objeto de la lista
                        setNewUbication({
                            lugar: ubicationData.lugar,
                            latitud: ubicationData.latitud,
                            longitud: ubicationData.longitud
                        });
                    } else {
                        console.error('No se encontraron datos de ubicación');
                    }
                })
                .catch(error => console.error('Error al obtener los datos de la ubicación:', error));
        }
    }, [avisoID]);

    console.log('Nueva ubicación:', newUbication); // Agregamos un log aquí para verificar el estado de la nueva ubicación

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewUbication({
            ...newUbication,
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Convert latitud and longitud to numbers
        const latitud = parseFloat(newUbication.latitud);
        const longitud = parseFloat(newUbication.longitud);

        // Check if the coordinates are valid
        if (isNaN(latitud) || isNaN(longitud) || latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
            alert('La latitud debe estar entre -90 y 90 grados y la longitud entre -180 y 180 grados.');
            return;
        }

        fetch(`http://localhost:8000/ubicacion/editar/${avisoID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUbication)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Datos actualizados:', data);
                alert('Ubicación actualizada correctamente.');
                window.location.href = '/pagina/mapa';
            })
            .catch(error => console.error('Error al actualizar la ubicación:', error));
    }

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Edita la Ubicacion</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
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
    );
}

export default MapaUpdate;
