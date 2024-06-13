import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/CustomNavbar_03';
import {host} from '../../conexion';

function TransparenciaUpdate() {
    const [transparencia, setTransparencia] = useState({
        num_articulo: '',
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const transparenciaID = searchParams.get('id_articulo');

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

    const handleInputChange = (event) => {
        setTransparencia({
            ...transparencia,
            [event.target.name]: event.target.value,
        });
    };

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
