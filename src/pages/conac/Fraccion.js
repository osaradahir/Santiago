import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_04';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import { host } from '../../conexion';

function FraccionConac() {
    const [fracciones, setFracciones] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}fraccion-conac`); // Endpoint para obtener todas las fracciones
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setFracciones(data);
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleRowClick = (id_fraccion) => {
        // Verificar si la fila clicada ya está seleccionada
        if (selectedId === id_fraccion) {
            return; // Si ya está seleccionada, no hacemos nada
        } else {
            setSelectedId(id_fraccion);
        }
    };

    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta fracción?');
            if (confirmDelete) {
                fetch(`${host}fraccion-conac/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar la fracción');
                        }
                        return response.json();
                    })
                    .then(() => {
                        const updatedFracciones = fracciones.filter(fraccion => fraccion.id_fraccion !== selectedId);
                        setFracciones(updatedFracciones);
                        setSelectedId(null);
                        alert('Fracción eliminada correctamente');
                    })
                    .catch(error => {
                        console.error('Error al eliminar la fracción:', error);
                    });
            }
        } else {
            alert('Por favor, selecciona una fracción para eliminar.');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = searchTerm ?
        fracciones.filter(fraccion =>
            fraccion.nombre_fraccion.toLowerCase().includes(searchTerm.toLowerCase())
        ) : fracciones;

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>CONAC Fracciones</b></h1>
                    <div className="d-flex align-items-center">
                        <div className="input-group rounded-pill border border-1 me-2 custom-border">
                            <input
                                type="search"
                                className="form-control rounded-pill border border-2 text-center custom-border"
                                placeholder="Buscar..."
                                aria-label="Buscar"
                                aria-describedby="search-addon"
                                style={{ color: "#04703F" }}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <Link to="/conac/fraccion/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/conac/fraccion/actualizar?id_fraccion=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{ backgroundColor: "white", border: "none" }} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            </div>
            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ backgroundColor: "transparent", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre de la Fracción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((fraccion) => (
                            <tr
                                key={fraccion.id_fraccion}
                                onClick={() => handleRowClick(fraccion.id_fraccion)}
                                className={selectedId === fraccion.id_fraccion ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F" }}>{fraccion.nombre_fraccion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FraccionConac;
