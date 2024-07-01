import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/page/Pagina.css';
import CustomNavbar from '../../components/CustomNavbar_01';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import {host} from '../../conexion';

function Carrusel() {
    const [carrusel, setCarrusel] = useState([]);
    const [containerWidth, setContainerWidth] = useState(window.innerWidth);
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchCarrusel = async () => {
            try {
                const response = await fetch(`${host}avisos`);
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
            await fetch(`${host}aviso/borrar/${selectedId}`, {
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
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/pagina/carrusel/actualizar?id_aviso=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDelete}>
                            <DeleteIcon />
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
                                src={`${host}${aviso.ruta}${aviso.imagen}`} 
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
