import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/page/Pagina.css';
import CustomNavbar from '../../components/CustomNavbar_01';
import {host} from '../../conexion';

function Color() {
    const [datosColores, setDatosColores] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}color`);
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setDatosColores(data);
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    
    const handleRowClick = (id_color) => {
        setSelectedId(id_color);
    };
    

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredData = searchTerm ? 
        datosColores.filter(color => 
            color.nombre_color.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) : datosColores;



    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Colores</b></h1>
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
                        
                        <Link to={selectedId ? `/pagina/color/actualizar?id_color=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z" />
                                <path d="M13.752 4.396l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </Link>               
                    </div>
                </div>
            </div>
            <div id="tabla-container" className="px-4 py-4">
                <table className="table table-hover" style={{ backgroundColor: "transparent", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Jerarquía</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((color) => (
                            <tr
                                key={color.id_color}
                                onClick={() => handleRowClick(color.id_color)}
                                className={selectedId === color.id_color ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{color.nombre_color}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: color.valor_hex,
                                        border: '1px solid #000'
                                    }}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Color;
