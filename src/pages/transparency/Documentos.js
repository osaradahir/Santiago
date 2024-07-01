import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_02';
import { CreateIcon, DeleteIcon, Download, See } from '../../components/Icons';
import {host} from '../../conexion'

function Documentos() {
    const [datosDocumentos, setDatosDocumentos] = useState([]);
    const [fracciones, setFracciones] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseDocumentos = await fetch(`${host}documento`);
                const dataDocumentos = await responseDocumentos.json();
                
                // Verificar si los datos recibidos son un array
                if (Array.isArray(dataDocumentos)) {
                    setDatosDocumentos(dataDocumentos);
                } else {
                    console.error('Los datos recibidos no son un array:', dataDocumentos);
                }

                const responseFracciones = await fetch(`${host}fraccion`);
                const dataFracciones = await responseFracciones.json();
                
                // Transformar el array de fracciones en un objeto para un acceso más rápido
                const fraccionesMap = {};
                dataFracciones.forEach(fraccion => {
                    fraccionesMap[fraccion.id_fraccion] = fraccion.fraccion;
                });

                setFracciones(fraccionesMap);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleRowClick = (id_documento) => {
        // Verificar si la fila clicada ya está seleccionada
        if (selectedId === id_documento) {
            return; // Si ya está seleccionada, no hacemos nada
        } else {
            setSelectedId(id_documento);
        }
    }

    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar este documento?');
            if (confirmDelete) {
                fetch(`${host}documento/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el documento');
                    }
                    return response.json();
                })
                .then(() => {
                    const updatedDocumentos = datosDocumentos.filter(documento => documento.id_documento !== selectedId);
                    setDatosDocumentos(updatedDocumentos);
                    setSelectedId(null);
                })
                .catch(error => {
                    console.error('Error al eliminar el documento:', error);
                });
            }
        } else {
            alert('Por favor, selecciona un documento para eliminar.');
        }
    }

    const handleDownload = () => {
        if (selectedId) {
            const selectedDocumento = datosDocumentos.find(doc => doc.id_documento === selectedId);
            if (selectedDocumento) {
                const downloadLink = document.createElement('a');
                downloadLink.href = `${host}${selectedDocumento.ruta}/${selectedDocumento.documento}`;
                downloadLink.download = selectedDocumento.documento;
                downloadLink.click();
            } else {
                alert('Documento no encontrado.');
            }
        } else {
            alert('Por favor, selecciona un documento para descargar.');
        }
    }

    const handleSee = () => {
        if (selectedId) {
            const selectedDocumento = datosDocumentos.find(doc => doc.id_documento === selectedId);
            if (selectedDocumento) {
                const enlaceDocumento = `https://docs.google.com/gview?url=${host}${selectedDocumento.ruta}/${selectedDocumento.documento}&embedded=true`;
                window.open(enlaceDocumento, "width=800,height=600");
            } else {
                alert('Documento no encontrado.');
            }
        } else {
            alert('Por favor, selecciona un documento para ver.');
        }
    }
    
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredDocumentos = searchTerm ?
    datosDocumentos.filter(documento => 
        fracciones[documento.id_fraccion].toLowerCase().includes(searchTerm.toLowerCase()) ||
        documento.trimestre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documento.año.toString().includes(searchTerm.toLowerCase()) ||
        documento.documento.toLowerCase().includes(searchTerm.toLowerCase())
    ): datosDocumentos;

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Archivos</b></h1>
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
                        <Link to="/transparencia/archivo/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDownload}>
                            <Download />
                        </button>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleSee}>
                            <See />
                       </button>
                        
                    </div>
                </div>
            </div>
            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ backgroundColor: "transparent", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Fraccion</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Trimestre</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Año</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Documento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocumentos.map((documento) => (
                            <tr
                                key={documento.id_documento}
                                onClick={() => handleRowClick(documento.id_documento)}
                                className={selectedId === documento.id_documento ? 'selected' : ''}
                                style={{ cursor: "pointer" }}
                            >
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{fracciones[documento.id_fraccion]}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{documento.trimestre}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{documento.año}</td>
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{documento.documento}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Documentos;
