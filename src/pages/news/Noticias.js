import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/news/Noticias.css';
import CustomNavbar from '../../components/CustomNavbar';


function Noticia() {
    const [datosNoticia, setDatosNoticia] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [containerWidth] = useState(window.innerWidth);  // No setter needed
    const [containerHeight] = useState(window.innerHeight);  // No setter needed

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/noticia');
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setDatosNoticia(data);
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleRowClick = (id_titulo) => {
        setSelectedId(id_titulo);
    };
    
    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta noticia?');
            if (confirmDelete) {
                console.log(`Deleting noticia with ID: ${selectedId}`);
                fetch(`http://localhost:8000/noticia/borrar/${selectedId}`, {
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
                    const updatedNoticia = datosNoticia.filter(noticia => noticia.id_titulo !== selectedId);
                    setDatosNoticia(updatedNoticia);
                    setSelectedId(null);
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
                            />
                        </div>
                        <Link to="/noticias/insertar" className="link-dark text-decoration-none px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </Link>
                        <Link to={selectedId ? `/noticias/actualizar?id_noticia=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
            <div id="tabla-container" className="px-4 py-4">
                <table className="table table-hover" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F", backgroundColor:"#81b79e", }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Titulo</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Contenido</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Imagen</th>
                        </tr>
                    </thead>
                    <tbody >
                        {datosNoticia.map((noticia) => (
                            <tr
                                key={noticia.id_titulo}
                                onClick={() => handleRowClick(noticia.id_titulo)}
                                className={selectedId === noticia.id_titulo ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{noticia.titulo}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{noticia.contenido && truncateText(noticia.contenido, 20)}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                <img src={`http://localhost:8000/${noticia.ruta}${noticia.imagen}`} alt="Logo" style={{ width: tamañoOptimo?.width, height: tamañoOptimo?.height, margin: 'auto', display: 'block'}} />
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
