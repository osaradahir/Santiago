import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Articulos.css';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion'

function Articulos() {
    const [datosArticulos, setDatosArticulos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}articulo`);
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setDatosArticulos(data);
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleSend = (num_articulo) => {
        // Navegar a la página del artículo con el número de artículo en la URL
        window.location.href = `/funcionarios/fracciones?num_articulo=${num_articulo}`;
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Articulos</b></h1>
                </div>
            </div>
            <div className="button-container px-4 py-4">
                <div className="d-flex flex-wrap justify-content-center" style={{ marginTop: "200px" }}>
                    {datosArticulos.map(articulo => (
                        <button
                            key={articulo.id}
                            onClick={() => handleSend(articulo.num_articulo)}
                            className="custom-button me-2 mb-2"
                        >
                            {articulo.num_articulo}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Articulos;
