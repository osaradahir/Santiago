import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function FraccionInsert() {
    const [newFraccion, setNewFraccion] = useState({
        fraccion: '',
        descripcion: '',
        num_articulo: '',
        areas: []
    });
    const [num_articulo, setNumArticulo] = useState([]);
    const [areas, setAreas] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchNumArticulo = async () => {
            try {
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
        const fetchAreas = async () => {
            try {
                const response = await fetch(`${host}areas`);
                const data = await response.json();
                setAreas(data);
            } catch (error) {
                console.error('Error al obtener las áreas:', error);
            }
        };

        fetchAreas();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFraccion({
            ...newFraccion,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setNewFraccion({
                ...newFraccion,
                areas: [...newFraccion.areas, value]
            });
        } else {
            setNewFraccion({
                ...newFraccion,
                areas: newFraccion.areas.filter(area => area !== value)
            });
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos a enviar:', newFraccion);

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
                areas: []
            });
            alert('Fraccion creada con éxito')
            window.location.href = '/transparencia/fraccion';

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Ingresa una nueva Fracción</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="fraccion"
                                name="fraccion"
                                className="fs-2 border-bottom-only no-rounded form-control"
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
                                className="fs-2 border-bottom-only no-rounded form-control"
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
                                className="fs-2 border-bottom-only no-rounded form-control"
                                placeholder="Descripción"
                                value={newFraccion.descripcion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center" >
                            <Button className="fs-2 border-bottom-only no-rounded form-control" onClick={handleShowModal}>
                                Seleccionar Áreas
                            </Button>
                        </div>
                    </div>
                    <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                        <Link to="/transparencia/fraccion" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>

                {/* Modal para mostrar las áreas seleccionadas */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Seleccionar Áreas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group d-flex flex-wrap justify-content-center">
                            <div className="column">
                                {areas.slice(0, Math.ceil(areas.length / 2)).map((area, index) => (
                                    <div key={index} className="form-check mb-3 mx-3">
                                        <input
                                            type="checkbox"
                                            id={`area-${area.id_area}`}
                                            value={area.id_area}
                                            checked={newFraccion.areas.includes(area.id_area.toString())}
                                            onChange={handleCheckboxChange}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={`area-${area.id_area}`} className="form-check-label">{area.nombre_area}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="column">
                                {areas.slice(Math.ceil(areas.length / 2)).map((area, index) => (
                                    <div key={index} className="form-check mb-3 mx-3">
                                        <input
                                            type="checkbox"
                                            id={`area-${area.id_area}`}
                                            value={area.id_area}
                                            checked={newFraccion.areas.includes(area.id_area.toString())}
                                            onChange={handleCheckboxChange}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={`area-${area.id_area}`} className="form-check-label">{area.nombre_area}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default FraccionInsert;
