import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/events/Eventos.css';
import CustomNavbar from '../../components/CustomNavbar';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import {host} from '../../conexion';

function Evento() {
    const [datosEvento, setDatosEvento] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}evento`);
                const data = await response.json();
                // Verificar si los datos recibidos son un array
                if (Array.isArray(data)) {
                    setDatosEvento(data);
                    console.log('Datos obtenidos:', data);
                } else {
                    console.error('Los datos recibidos no son un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    
    const handleRowClick = (id_evento) => {
        setSelectedId(id_evento);
    };
    
    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar este evento?');
            if (confirmDelete) {
                fetch(`${host}evento/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el evento');
                    }
                    return response.json();
                })
                .then(() => {
                    const updatedEvento = datosEvento.filter(evento => evento.id_evento !== selectedId);
                    setDatosEvento(updatedEvento);
                    setSelectedId(null);
                })
                .catch(error => {
                    console.error('Error al eliminar el evento:', error);
                });
            }
        } else {
            alert('Por favor, selecciona un evento para eliminar.');
        }
    };

    // Función para convertir la hora de formato de 24 horas a 12 horas
    const convertirSegundosAHora = (segundos) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        return `${horas}:${minutos < 10 ? '0' : ''}${minutos}`;
    };

    const convertirFecha = (fecha) => {
        const partesFecha = fecha.split('-'); // Divide la fecha por los guiones
        return `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`; // Formatea como "dd-mm-yyyy"
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredData = searchTerm ? 
        datosEvento.filter(evento => 
            evento.titulo.toString().toLowerCase().includes(searchTerm.toLowerCase())  ||
            convertirFecha(evento.fecha).toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) : datosEvento;


    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Evento</b></h1>
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
                        <Link to="/eventos/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/eventos/actualizar?id_evento=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
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
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Descripcion</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Fecha</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Hora</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Imagen</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((evento) => (
                            <tr
                                key={evento.id_evento}
                                onClick={() => handleRowClick(evento.id_evento)}
                                className={selectedId === evento.id_evento ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{evento.titulo}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{evento.descripcion}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{convertirFecha(evento.fecha)}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{convertirSegundosAHora(evento.hora)}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                    <img src={`${host}${evento.ruta}${evento.imagen}`} style={{ maxWidth: "100px", maxHeight: "100px", margin: 'auto', display: 'block'}} alt="" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Evento;
