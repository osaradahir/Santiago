import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_01';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import { host } from '../../conexion';

function Expresidentes() {
    const [datosExPresidentes, setDatosExPresidentes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}expresidente`);
                const data = await response.json();
                setDatosExPresidentes(data);
                console.log(data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleRowClick = (id_expresidente) => {
        if (selectedId === id_expresidente) {
            return;
        } else {
            setSelectedId(id_expresidente);
            console.log("ID del expresidente seleccionado:", id_expresidente);
        }
    };

    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar este expresidente?');
            if (confirmDelete) {
                fetch(`${host}expresidente/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el expresidente');
                    }
                    return response.json();
                })
                .then(data => {
                    const updatedExPresidentes = datosExPresidentes.filter(expresidente => expresidente.id_expresidente !== selectedId);
                    setDatosExPresidentes(updatedExPresidentes);
                    setSelectedId(null);
                    alert('Ex presidente eliminado correctamente.');
                })
                .catch(error => {
                    console.error('Error al eliminar el expresidente:', error);
                });
            }
        } else {
            alert('Por favor, selecciona un expresidente para eliminar.');
        }

    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = searchTerm
        ? datosExPresidentes.filter(expresidente =>
            expresidente.nombre_exprecidente?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            expresidente.periodo?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        : datosExPresidentes;

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Ex Presidentes</b></h1>
                    <div className="d-flex align-items-center">
                        <div className="input-group rounded-pill border border-1 me-2 custom-border">
                            <input
                                type="search"
                                className="form-control rounded-pill border border-2 text-center custom-border"
                                placeholder="Buscar..."
                                aria-label="Buscar"
                                aria-describedby="search-addon"
                                style={{ color: "#04703F"}}
                                onChange={handleSearch}
                            />
                        </div>
                        <Link to="/pagina/expresidentes/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/pagina/expresidentes/actualizar?id_expresidente=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>

                    </div>
                </div>
            </div>

            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre Ex Presidente</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Periodo</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Foto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((expresidente) => (
                            <tr
                                key={expresidente.id_expresidente}
                                onClick={() => handleRowClick(expresidente.id_expresidente)}
                                className={selectedId === expresidente.id_expresidente ? 'selected' : ''}
                                style={{  cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{expresidente.nombre_expresidente}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{expresidente.periodo}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                    <img src={`${host}${expresidente.ruta}${expresidente.imagen}`} style={{ maxWidth: "100px", maxHeight: "100px", margin: 'auto', display: 'block'}} alt="" />
                                </td>
                            </tr>
                        ))}
                    </tbody>    
                </table>
            </div>
        </div>
    );
}

export default Expresidentes;