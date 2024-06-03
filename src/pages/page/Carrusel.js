import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/page/Pagina.css';
import CustomNavbar from '../../components/CustomNavbar_01';

function Carrusel() {
    const [carrusel, setCarrusel] = useState([]);
    const [containerWidth, setContainerWidth] = useState(window.innerWidth);
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchCarrusel = async () => {
            try {
                const response = await fetch('http://localhost:8000/avisos');
                const data = await response.json();
                if (data && data.length > 0) {
                    setCarrusel(data); // Guardamos todos los avisos
                }
            } catch (error) {
                console.error('Error al obtener el carrusel:', error);
            }
        };
    
        fetchCarrusel();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setContainerWidth(window.innerWidth);
            setContainerHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function calcularTamañoOptimo(containerWidth, containerHeight) {
        const maxWidth = containerWidth * 0.6; // Ajustamos a un tamaño más pequeño
        const maxHeight = containerHeight * 0.6; // Ajustamos a un tamaño más pequeño
        return { width: maxWidth * 0.29, height: maxHeight * 0.29 }; // Ajustamos las proporciones
    }

    const tamañoOptimo = calcularTamañoOptimo(containerWidth, containerHeight);

    const handleRowClick = (id) => {
        setSelectedId(id);
    };

    const handleDelete = async () => {
        if (!selectedId) {
            alert("No se ha seleccionado ningún aviso para eliminar.");
            return;
        }
    
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este aviso?");
        if (!confirmDelete) {
            return; // Si el usuario cancela la acción, salimos de la función
        }
    
        try {
            await fetch(`http://localhost:8000/aviso/borrar/${selectedId}`, {
                method: 'DELETE',
            });
            setCarrusel(carrusel.filter(aviso => aviso.id_aviso !== selectedId));
            setSelectedId(null);
            alert("Aviso eliminado correctamente.");
        } catch (error) {
            console.error('Error al eliminar el aviso:', error);
            alert('Error al eliminar el aviso.');
        }
    };
    

    return (
        <div className="pagina">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Carrusel</b></h1>
                    <div className="d-flex align-items-center">
                        <div className="input-group rounded-pill border border-1 me-2 custom-border"></div>
                        <Link to="/pagina/carrusel/insertar" className="link-dark text-decoration-none px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </Link>
                        <Link to={selectedId ? `/pagina/carrusel/actualizar?id_aviso=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
            
            <div className='bcontainer row'>
                {carrusel.map(aviso => (
                    <div 
                        key={aviso.id_aviso} 
                        className={`col-lg-3 col-md-4 col-sm-6 carrusel-item ${selectedId === aviso.id_aviso ? 'selected' : ''}`} 
                        style={{ 
                            width: tamañoOptimo.width, 
                            height: tamañoOptimo.height, 
                            margin: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleRowClick(aviso.id_aviso)}
                    >
                        {aviso.imagen ? (
                            <img 
                                src={`http://localhost:8000/${aviso.ruta}${aviso.imagen}`} 
                                alt={aviso.imagen} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transform: selectedId === aviso.id_aviso ? 'scale(1.1)' : 'scale(1)',
                                }} 
                            />
                        ) : (
                            <p>No hay una imagen disponible.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carrusel;
