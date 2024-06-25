import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/surveys/Encuestas.css';
import CustomNavbar from '../../components/CustomNavbar';
import {host} from '../../conexion';

function Encuestas() {
    const [datosEncuestas, setDatosEncuestas] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}encuesta`);
                const data = await response.json();
                // Mapear los datos para ajustar el formato de 'estado' y 'permisos'
                const encuestasConValoresString = data.map(encuesta => ({
                    ...encuesta,
                    // Ajusta el formato según sea necesario
                }));
                setDatosEncuestas(encuestasConValoresString);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    
    
    const handleRowClick = (id_encuesta) => {
        // Establecer el ID de la encuesta seleccionada
        setSelectedId(id_encuesta);
        console.log("ID de la encuesta seleccionado:", id_encuesta); // Imprimir el ID del encuesta seleccionado en la consola
    };
    
    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar esta encuesta?');
            if (confirmDelete) {
                fetch(`${host}encuesta/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar la encuesta');
                    }
                    return response.json();
                })
                .then(data => {
                    // Actualizar la lista de usuarios después de eliminar el usuario
                    const updatedUsuarios = datosEncuestas.filter(usuario => usuario.id !== selectedId);
                    setDatosEncuestas(updatedUsuarios);
                    // Limpiar la selección
                    setSelectedId(null);
                    alert('Encuesta eliminada correctamente');
                })
                .catch(error => {
                    console.error('Error al eliminar la encuesta:', error);
                });
            }
        } else {
            alert('Por favor, selecciona una encuesta para eliminar.');
        }

    };
    
    
    

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Encuesta</b></h1>
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
                        <Link to="/encuesta/insertar" className="link-dark text-decoration-none px-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="#04703F" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </Link>
                        <Link to={selectedId ? `/encuesta/actualizar?id_encuesta=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
                        <Link to={selectedId ? `/encuesta/ver?id_encuesta=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                                <svg width="54px" height="54px" viewBox="2 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#04703F">
                                    <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#04703F" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#04703F" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                        </Link>

                    </div>
                </div>
            </div>
            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {datosEncuestas.map((encuesta) => (
                        <tr
                         key={encuesta.id_encuesta}
                         onClick={() => handleRowClick(encuesta.id_encuesta)}
                         className={selectedId === encuesta.id_encuesta ? 'selected' : ''}
                         style={{ cursor: "pointer" }}
                        >
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{encuesta.titulo}</td>
                            
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Encuestas;
