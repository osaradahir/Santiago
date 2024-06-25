import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import {host} from '../../conexion';

function MapaUpdate() {
    /* The code snippet you provided is from a React functional component called `MapaUpdate`. Let's
    break down the code: */
    const [newUbication, setNewUbication] = useState({
        lugar: '',
        latitud: '',
        longitud: ''
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const avisoID = searchParams.get('id_aviso');

    /* The `useEffect` hook in the provided code snippet is responsible for fetching and updating the
    location data based on the `avisoID` when the component mounts or when `avisoID` changes. Here's
    a breakdown of what it does: */
    useEffect(() => {
        if (avisoID) {
            fetch(`${host}ubicacion/${avisoID}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const ubicationData = data[0];
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

    console.log('Nueva ubicación:', newUbication);

    /**
     * The `handleInputChange` function updates the `newUbication` state with the new value based on
     * the input field name.
     * @param event - The `event` parameter in the `handleInputChange` function is an object that
     * represents an event being triggered, such as a change in an input field. It contains information
     * about the event, including the target element that triggered the event (in this case, an input
     * field), and any data associated with
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewUbication({
            ...newUbication,
            [name]: value
        });
    }


    /**
     * The handleSubmit function handles form submission, validates latitude and longitude coordinates,
     * sends a PUT request to update location data, and redirects to a map page upon successful update.
     * @param event - The `event` parameter in the `handleSubmit` function is an event object that
     * represents the event that triggered the function. In this case, it is used to prevent the
     * default behavior of a form submission using `event.preventDefault()`. This is commonly done in
     * form submission handlers to prevent the page from reloading
     * @returns The function `handleSubmit` is returning either an alert message indicating that the
     * latitude and longitude values should be within specific ranges, or it is making a PUT request to
     * update the location data and then redirecting the user to the '/pagina/mapa' page after
     * successfully updating the location.
     */
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

        fetch(`${host}ubicacion/editar/${avisoID}`, {
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

   /* The `return` statement in the provided code snippet is responsible for rendering the JSX elements
   that make up the user interface of the `MapaUpdate` component. Here's a breakdown of what each
   part of the returned JSX code is doing: */
    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Edita la Ubicacion</h1>
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

export default MapaUpdate;
