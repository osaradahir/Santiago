import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';

function FraccionUpdate() {
    const [newFraccion, setNewFraccion] = useState({
        fraccion: '',
        descripcion: '',
        num_articulo: '',
        area: ''
    });
    const [num_articulo, setNumArticulo] = useState([]);
    const [areas, setAreas] = useState([]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const fraccionID = searchParams.get('id_fraccion');

    useEffect(() => {
        console.log('fraccionID:', fraccionID); // Debugging

        if (fraccionID) {
            fetch(`http://localhost:8000/fraccion/${fraccionID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Datos recuperados:', data); // Debugging
                    if (Array.isArray(data) && data.length > 0) {
                        const firstFraccion = data[0];
                        setNewFraccion({
                            fraccion: firstFraccion.fraccion || '',
                            descripcion: firstFraccion.descripcion || '',
                            num_articulo: firstFraccion.num_articulo || '',
                            area: firstFraccion.area || ''
                        });
                    } else {
                        console.error('Los datos recuperados no son válidos:', data);
                    }
                })
                .catch(error => console.error('Error al obtener los datos:', error));
        }
    }, [fraccionID]);

    useEffect(() => {
        const fetchNumArticulo = async () => {
            try {
                const response = await fetch('http://localhost:8000/articulo');
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
                const response = await fetch('http://localhost:8000/usuario'); // Asegúrate de que la URL sea correcta
                const data = await response.json();
                if (Array.isArray(data)) {
                    const extractedAreas = data.map(usuario => usuario.area);
                    const uniqueAreas = [...new Set(extractedAreas)];
                    setAreas(uniqueAreas);
                } else {
                    console.error('La respuesta no es una lista:', data);
                }
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
            const response = await fetch(`http://localhost:8000/fraccion/editar/${fraccionID}`, {
                method: 'PUT',
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
                <h1 className="fs-1">Actualizar Artículo</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="fraccion"
                            name="fraccion"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Número de la Fracción"
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
                            {num_articulo.map((num, index) => (
                                <option key={index} value={num}>
                                    {num}
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
                            placeholder="Descripción"
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

export default FraccionUpdate;
