import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/page/Pagina.css';
import CustomNavbar from '../../components/CustomNavbar_01';

function Pagina() {
    const [logo, setLogo] = useState(null);
    const [containerWidth, setContainerWidth] = useState(window.innerWidth);
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await fetch('http://localhost:8000/logo');
                const data = await response.json();
                if (data && data.length > 0) {
                    setLogo(data[0]); // Asumimos que solo hay un logo activo
                }
            } catch (error) {
                console.error('Error al obtener el logo:', error);
            }
        };
    
        fetchLogo();
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

    function calcularTamañoOptimo(logo, containerWidth, containerHeight) {
        if (!logo) return null;
    
        const logoWidth = logo.ancho;
        const logoHeight = logo.alto;
    
        // Calcula la relación de aspecto original del logo
        const aspectRatio = logoWidth / logoHeight;
    
        // Calcula el ancho y alto máximo permitido para el logo
        const maxWidth = containerWidth * 0.8; // Puedes ajustar este valor según tu diseño
        const maxHeight = containerHeight * 0.8; // Puedes ajustar este valor según tu diseño
    
        // Calcula el tamaño óptimo en función de la relación de aspecto original y las dimensiones máximas
        let width = maxWidth * 0.29; // Reducir el ancho al 40%
        let height = width / aspectRatio;
    
        // Verifica si la altura excede la altura máxima permitida
        if (height > maxHeight) {
            height = maxHeight * 0.29; // Reducir la altura al 40%
            width = height * aspectRatio;
        }
    
        return { width, height };
    }
    

    const tamañoOptimo = calcularTamañoOptimo(logo, containerWidth, containerHeight);

    const handleDelete = async () => {
        try {
            const response = await fetch('http://localhost:8000/logo/borrar', {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                window.location.href= "/pagina/logo"
            } else {
                const errorData = await response.json();
                alert(`Error al borrar el logo: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error al borrar el logo:', error);
            alert('Error al borrar el logo.');
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Logo</b></h1>
                    <div className="d-flex align-items-center">
                        <div className="input-group rounded-pill border border-1 me-2 custom-border">
                            
                        </div>
                        <Link to="/pagina/logo/insertar" className="link-dark text-decoration-none px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
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
            <div id="logo-container" className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                {logo ? (
                    <img src={`http://localhost:8000/${logo.ruta}${logo.archivo}`} alt="Logo" style={{ width: tamañoOptimo?.width, height: tamañoOptimo?.height, marginTop: '25%'}} />
                ) : (
                    <p>No hay un logo disponible.</p>
                )}
            </div>
        </div>
    );
}

export default Pagina;