import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/page/Pagina.css';
import CustomNavbar from '../../components/CustomNavbar_01';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import {host} from '../../conexion';

function Mapa() {
    const [datosMapa, setDatosMapa] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}ubicacion`);
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setDatosMapa(data);
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    
    const handleRowClick = (id_ubicacion) => {
        setSelectedId(id_ubicacion);
    };
    
    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta ubicacion?');
            if (confirmDelete) {
                fetch(`${host}ubicacion/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar la ubicacion');
                    }
                    return response.json();
                })
                .then(() => {
                    const updatedMapa = datosMapa.filter(mapa => mapa.id_ubicacion !== selectedId);
                    setDatosMapa(updatedMapa);
                    setSelectedId(null);
                    alert('Ubicacion eliminada correctamente.');
                })
                .catch(error => {
                    console.error('Error al eliminar la ubicacion:', error);
                });
            }
        } else {
            alert('Por favor, selecciona una ubicacion para eliminar.');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredData = searchTerm ? 
        datosMapa.filter(mapa => 
            mapa.lugar.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) : datosMapa;



    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Mapa</b></h1>
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
                        <Link to="/pagina/mapa/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/pagina/mapa/actualizar?id_aviso=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Lugar</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Latitud</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Longitud</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((mapa) => (
                            <tr
                                key={mapa.id_ubicacion}
                                onClick={() => handleRowClick(mapa.id_ubicacion)}
                                className={selectedId === mapa.id_ubicacion ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{mapa.lugar}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{mapa.latitud}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{mapa.longitud}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Mapa;
