import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_04';
import { host } from '../../conexion';
import { CrateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';

function Tomo() {
    const [datosTransparencia, setDatosTransparencia] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}tomo`); // Endpoint para obtener todos los tomos
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setDatosTransparencia(data);
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleRowClick = (id_tomo) => {
        // Verificar si la fila clicada ya está seleccionada
        if (selectedId === id_tomo) {
            return; // Si ya está seleccionada, no hacemos nada
        } else {
            setSelectedId(id_tomo);
        }
    }

    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar este tomo?');
            if (confirmDelete) {
                fetch(`${host}tomo/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el tomo');
                    }
                    return response.json();
                })
                .then(() => {
                    const updatedTransparencia = datosTransparencia.filter(tomo => tomo.id_tomo !== selectedId);
                    setDatosTransparencia(updatedTransparencia);
                    setSelectedId(null);
                    alert('Tomo eliminado correctamente');
                })
                .catch(error => {
                    console.error('Error al eliminar el tomo:', error);
                });
            }
        } else {
            alert('Por favor, selecciona un tomo para eliminar.');
        }
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const filteredData = searchTerm ? 
    datosTransparencia.filter(tomo => 
        tomo.nombre_tomo.toLowerCase().includes(searchTerm.toLowerCase())
    ) : datosTransparencia;

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>CONAC Tomos</b></h1>
                    <div className="d-flex align-items-center">
                        <div className="input-group rounded-pill border border-1 me-2 custom-border">
                            <input
                                type="search"
                                className="form-control rounded-pill border border-2 text-center custom-border"
                                placeholder="Buscar..."
                                aria-label="Buscar"
                                aria-describedby="search-addon"
                                style={{ color: "#04703F"}}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        {/* Ajusta los enlaces y botones según tu flujo de la aplicación */}
                        <Link to="/conac/tomo/insertar" className="link-dark text-decoration-none px-2">
                            <CrateIcon />
                        </Link>
                        <Link to={selectedId ? `/conac/tomo/actualizar?id_tomo=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            </div>
            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ backgroundColor: "transparent", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre del Tomo</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((tomo) => (
                            <tr
                                key={tomo.id_tomo}
                                onClick={() => handleRowClick(tomo.id_tomo)}
                                className={selectedId === tomo.id_tomo ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{tomo.nombre_tomo}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{tomo.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Tomo;
