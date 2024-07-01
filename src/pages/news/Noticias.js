import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/news/Noticias.css';
import CustomNavbar from '../../components/CustomNavbar';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import  {host} from '../../conexion';


function Noticia() {
    const [datosNoticia, setDatosNoticia] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [containerWidth] = useState(window.innerWidth);  // No setter needed
    const [containerHeight] = useState(window.innerHeight);  // No setter needed
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}noticia`);
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setDatosNoticia(data);
                    console.log('Datos recibidos de la API:', data); 
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleRowClick = (id_noticia) => {
        setSelectedId(id_noticia === selectedId ? null : id_noticia);
    };
    
    
    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta noticia?');
            if (confirmDelete) {
                console.log(`Deleting noticia with ID: ${selectedId}`);
                fetch(`${host}noticia/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    console.log(response);
                    if (!response.ok) {
                        throw new Error('Error al eliminar la noticia');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Noticia eliminada:', data);
                    const updatedNoticia = datosNoticia.filter(noticia => noticia.id_noticia !== selectedId);
                    setDatosNoticia(updatedNoticia);
                    setSelectedId(null);
                    alert('Noticia eliminada correctamente.');
                })
                .catch(error => {
                    console.error('Error al eliminar la noticia:', error);
                });
            }
        } else {
            alert('Por favor, selecciona una noticia para eliminar.');
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    function calcularTamañoOptimo(containerWidth, containerHeight) {
        const maxWidth = containerWidth * 0.6; // Ajustamos a un tamaño más pequeño
        const maxHeight = containerHeight * 0.6; // Ajustamos a un tamaño más pequeño
        return { width: maxWidth * 0.25, height: maxHeight * 0.25 }; // Ajustamos las proporciones
    }

    const tamañoOptimo = calcularTamañoOptimo(containerWidth, containerHeight);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredData = searchTerm ? 
        datosNoticia.filter(noticia => 
            noticia.titulo.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) : datosNoticia;


    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Noticias</b></h1>
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
                        <Link to="/noticias/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/noticias/actualizar?id_noticia=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
                        <tr style={{ borderBottom: "2px solid #04703F", backgroundColor:"#81b79e", }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Titulo</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Contenido</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Imagen</th>
                        </tr>
                    </thead>
                    <tbody >
                        {filteredData.map((noticia) => (
                            <tr
                                key={noticia.id_noticia}
                                onClick={() => handleRowClick(noticia.id_noticia)}
                                className={selectedId === noticia.id_noticia ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{noticia.titulo}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{noticia.contenido && truncateText(noticia.contenido, 20)}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                <img src={`${host}${noticia.ruta}${noticia.imagen}`} alt="Logo" style={{ width: tamañoOptimo?.width, height: tamañoOptimo?.height, margin: 'auto', display: 'block'}} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Noticia;
