import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/surveys/Encuestas.css';
import CustomNavbar from '../../components/CustomNavbar';
import { CreateIcon, UpdateIcon, DeleteIcon, See } from '../../components/Icons';
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
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/encuesta/actualizar?id_encuesta=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>
                        <Link to={selectedId ? `/encuesta/ver?id_encuesta=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <See />
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
