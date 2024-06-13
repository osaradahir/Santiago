import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import '../../css/Articulos.css';
import CustomNavbar from '../../components/CustomNavbar_03';
import {host} from '../../conexion';

function Fracciones() {
    const [datosFracciones, setDatosFracciones] = useState([]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const articuloID = searchParams.get('num_articulo');
    const storedArea = localStorage.getItem('area');

    useEffect(() => {
        if (articuloID && storedArea) {
            fetch(`${host}fracciones/busqueda?num_articulo=${articuloID}&area=${storedArea}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API');
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setDatosFracciones(data);
                    }
                })
                .catch(error => console.error('Error al obtener los datos:', error));
        }
    }, [articuloID, storedArea]);

    const handleSend = (id_fraccion) => {
        window.location.href = `/funcionarios/archivos?fraccion=${id_fraccion}`;
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Fracciones</b></h1>
                </div>
            </div>
            <div className="button-container mt-5 px-4 py-4">
                <div className="d-flex flex-wrap justify-content-center">
                {datosFracciones.length > 0 ? (
                        datosFracciones.map((fraccion) => (
                            <button
                                key={fraccion.id_fraccion}
                                onClick={() => handleSend(fraccion.id_fraccion)}
                                className="custom-button me-2 mb-2"
                            >
                                {fraccion.fraccion} {fraccion.descripcion}
                            </button>
                        ))
                        ) : (
                            <p className='no'>No se asignaron fracciones para esta area.</p>
                        )}
                </div>
            </div>
        </div>
    );
}

export default Fracciones;
