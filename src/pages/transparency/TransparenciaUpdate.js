import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/CustomNavbar_03';
import {host} from '../../conexion';

function TransparenciaUpdate() {
    /* The code `const [transparencia, setTransparencia] = useState({ num_articulo: '' });` is using
    the `useState` hook in React to declare a state variable named `transparencia` and a function to
    update that state variable named `setTransparencia`. */
    const [transparencia, setTransparencia] = useState({
        num_articulo: '',
    });

    /* The code snippet you provided is extracting the query parameter 'id_articulo' from the current 
    URL. Here's a breakdown of what each line is doing: */

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const transparenciaID = searchParams.get('id_articulo');

    /* The `useEffect` hook in React is used to perform side effects in function components. In this
    case, the `useEffect` hook is being used to fetch data from an API endpoint based on the
    `transparenciaID` value. Here's a breakdown of what the `useEffect` is doing: */

    useEffect(() => {
        if (transparenciaID) {
            fetch(`${host}articulo/${transparenciaID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se encontraron datos de transparencia');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const transparenciaData = data[0];
                        setTransparencia({
                            num_articulo: transparenciaData.num_articulo,
                        });
                    } else {
                        throw new Error('No se encontraron datos de transparencia');
                    }
                })
                .catch(error => console.error('Error al obtener los datos:', error));
        }
    }, [transparenciaID]);

    /**
     * The function `handleInputChange` updates the `transparencia` state object with the new value
     * based on the input field name.
     * @param event - The `event` parameter in the `handleInputChange` function is an object that
     * represents the event that occurred (e.g., a change event) on the input field. It contains
     * information about the event, such as the target element (in this case, the input field that
     * triggered the event) and
     */
    const handleInputChange = (event) => {
        setTransparencia({
            ...transparencia,
            [event.target.name]: event.target.value,
        });
    };

    /**
     * The handleSubmit function sends a PUT request to update an article with the provided data and
     * handles the response accordingly.
     * @param event - The `event` parameter in the `handleSubmit` function is an event object that
     * represents the event that was triggered, in this case, it is used to prevent the default
     * behavior of a form submission using `event.preventDefault()`. This is commonly used in form
     * submission handling to prevent the default form submission behavior
     */
    
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${host}articulo/editar/${transparenciaID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transparencia),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el artículo');
            }
            return response.json();
        })
        .then(data => {
            console.log('Artículo actualizado:', data);
            alert('Artículo actualizado correctamente');
            window.location.href = '/transparencia/articulo';
        })
        .catch(error => console.error(error.message));
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa un nuevo Articulo</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="number"
                            id="num_articulo"
                            name="num_articulo"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Numero del articulo"
                            value={transparencia.num_articulo}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/transparencia/articulo" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default TransparenciaUpdate;
