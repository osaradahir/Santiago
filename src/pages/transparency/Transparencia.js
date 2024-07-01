import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_02';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import {host} from '../../conexion';


function Transparencia() {
    const [datosTransparencia, setDatosTransparencia] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}articulo`);
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
    
    const handleRowClick = (id_articulo) => {
        // Verificar si la fila clicada ya está seleccionada
        if (selectedId === id_articulo) {
            return; // Si ya está seleccionada, no hacemos nada
        } else {
            setSelectedId(id_articulo);
        }
    }

    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar este artículo?');
            if (confirmDelete) {
                fetch(`${host}articulo/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el artículo');
                    }
                    return response.json();
                })
                .then(() => {
                    const updatedTransparencia = datosTransparencia.filter(transparencia => transparencia.id_articulo !== selectedId);
                    setDatosTransparencia(updatedTransparencia);
                    setSelectedId(null);
                    alert('Artículo eliminado correctamente');
                })
                .catch(error => {
                    console.error('Error al eliminar el artículo:', error);
                });
            }
        } else {
            alert('Por favor, selecciona un artículo para eliminar.');
        }
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const filteredData = searchTerm ? 
    datosTransparencia.filter(transparencia => 
        transparencia.num_articulo.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) : datosTransparencia;


    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Articulos</b></h1>
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
                        <Link to="/transparencia/articulo/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/transparencia/articulo/actualizar?id_articulo=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Articulo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((transparencia) => (
                            <tr
                                key={transparencia.id_articulo}
                                onClick={() => handleRowClick(transparencia.id_articulo)}
                                className={selectedId === transparencia.id_articulo ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{transparencia.num_articulo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Transparencia;