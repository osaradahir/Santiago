import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function FraccionInsert() {
    const [newFraccion, setNewFraccion] = useState({
        fraccion: '',
        descripcion: '',
        num_articulo: '',
        area: ''
    });
    const [num_articulo, setNumArticulo] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchNumArticulo = async () => {
            try{
                const response = await fetch(`${host}articulo`);
                const data = await response.json();
                const extractedNumArticulo = data.map(articulo => articulo.num_articulo);
                const uniqueNumArticulo = [...new Set(extractedNumArticulo)];
                setNumArticulo(uniqueNumArticulo);
            } catch (error) {
                console.error('Error al obtener los artículos:', error);
            }
        };

        fetchNumArticulo();
    }, []);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch(`${host}usuario`); // Asegúrate de que la URL sea correcta
                const data = await response.json();
                const extractedAreas = data.map(usuario => usuario.area);
                const uniqueAreas = [...new Set(extractedAreas)];
                setAreas(uniqueAreas);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFraccion({
            ...newFraccion,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${host}fraccion/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFraccion)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewFraccion({
                fraccion: '',
                descripcion: '',
                num_articulo: '',
                area: ''
            });
            window.location.href = '/transparencia/fraccion';

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
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
                            type="text"
                            id="fraccion"
                            name="fraccion"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Numero de la Fraccion"
                            value={newFraccion.fraccion}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="num_articulo"
                            name="num_articulo"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newFraccion.num_articulo}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un artículo</option>
                            {num_articulo.map((num_articulo, index) => (
                                <option key={index} value={num_articulo}>
                                    {num_articulo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Descripcion"
                            value={newFraccion.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="area"
                            name="area"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newFraccion.area}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un área</option>
                            {areas.map((area, index) => (
                                <option key={index} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
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

export default FraccionInsert;
