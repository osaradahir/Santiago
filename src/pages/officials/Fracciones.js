import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/user/Articulos.css';
import { useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

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
            <div className="button-container1 d-flex justify-content-center flex-wrap">
                {datosFracciones.length > 0 ? (
                    datosFracciones.map((fraccion) => (
                        <button
                            key={fraccion.id_fraccion}
                            onClick={() => handleSend(fraccion.id_fraccion)}
                            className="custom-button"
                        >
                            <div>
                                <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{fraccion.fraccion}</span>
                                <br />
                                <span>{fraccion.descripcion}</span>
                            </div>
                        </button>
                    ))
                ) : (
                    <p className='no'>No se asignaron fracciones para esta área.</p>
                )}
            </div>
        </div>
    );
}

export default Fracciones;
