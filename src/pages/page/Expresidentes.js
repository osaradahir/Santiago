import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_01';
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </Link>
                        <Link to={selectedId ? `/pagina/expresidentes/actualizar?id_expresidente=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z" />
                                <path d="M13.752 4.396l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDelete}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
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
                                    <img src={`${host}${expresidente.ruta}${expresidente.imagen}`} style={{ maxWidth: "100px", maxHeight: "100px", margin: 'auto', display: 'block'}} />
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