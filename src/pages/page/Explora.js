import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_01';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import { host } from '../../conexion';

function Explora() {
    const [datosExplora, setDatosExplora] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [containerWidth] = useState(window.innerWidth);
    const [containerHeight] = useState(window.innerHeight);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}explora`);
                const data = await response.json();
                setDatosExplora(data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleRowClick = (id_explora) => {
        if (selectedId === id_explora) {
            return; 
        } else {
            setSelectedId(id_explora);
            console.log("ID del sitio seleccionado:", id_explora);
        }
    };
    
    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar este sitio?');
            if (confirmDelete) {
                fetch(`${host}explora/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el sitio');
                    }
                    return response.json();
                })
                .then(data => {
                    const updatedExplora = datosExplora.filter(sitio => sitio.id_explora !== selectedId);
                    setDatosExplora(updatedExplora);
                    setSelectedId(null);
                    alert('Sitio eliminado correctamente.');
                })
                .catch(error => {
                    console.error('Error al eliminar el sitio:', error);
                });
            }
        } else {
            alert('Por favor, selecciona un sitio para eliminar.');
        }
    };

    function calcularTamañoOptimo(containerWidth, containerHeight) {
        const maxWidth = containerWidth * 0.6;
        const maxHeight = containerHeight * 0.6;
        return { width: maxWidth * 0.25, height: maxHeight * 0.25 };
    }
    
    const tamañoOptimo = calcularTamañoOptimo(containerWidth, containerHeight);
    
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredData = searchTerm 
    ? datosExplora.filter(sitio => 
        sitio.nombre_sitio?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        sitio.direccion?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        sitio.categoria?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        sitio.descripcion?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) 
    : datosExplora;

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Explora Sitios</b></h1>
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
                        <Link to="/pagina/explora/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/pagina/explora/actualizar?id_explora=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre Sitio</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Dirección</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Categoria</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Descripción</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Imagen</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((sitio) => (
                        <tr
                            key={sitio.id_explora}
                            onClick={() => handleRowClick(sitio.id_explora)}
                            className={selectedId === sitio.id_explora ? 'selected' : ''}
                            style={{  cursor: "pointer" }}
                        >
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{sitio.nombre_sitio}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{sitio.direccion}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{sitio.categoria}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{sitio.descripcion}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                <img src={`${sitio.ruta}`} alt="" style={{ width: tamañoOptimo?.width, height: tamañoOptimo?.height, margin: 'auto', display: 'block'}} />
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Explora;
