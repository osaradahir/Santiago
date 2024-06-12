import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_02';

function Documentos() {
    const [datosDocumentos, setDatosDocumentos] = useState([]);
    const [fracciones, setFracciones] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseDocumentos = await fetch('http://localhost:8000/documento');
                const dataDocumentos = await responseDocumentos.json();
                
                // Verificar si los datos recibidos son un array
                if (Array.isArray(dataDocumentos)) {
                    setDatosDocumentos(dataDocumentos);
                } else {
                    console.error('Los datos recibidos no son un array:', dataDocumentos);
                }

                const responseFracciones = await fetch('http://localhost:8000/fraccion');
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
                fetch(`http://localhost:8000/documento/borrar/${selectedId}`, {
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
                downloadLink.href = `http://localhost:8000/${selectedDocumento.ruta}/${selectedDocumento.documento}`;
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
                const enlaceDocumento = `https://docs.google.com/gview?url=https://lsp0pphc-8000.usw3.devtunnels.ms/${selectedDocumento.ruta}/${selectedDocumento.documento}&embedded=true`;
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
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDownload}>
                            <svg width="54px" height="54px" viewBox="2 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#04703F">
                                <path id="Vector" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke="#04703F" stroke-width="1.176" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>

                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleSee}>
                            <svg width="54px" height="54px" viewBox="2 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#04703F">
                                <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#04703F" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#04703F" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                       </button>
                        
                    </div>
                </div>
            </div>
            <div id="tabla-container" className="px-4 py-4">
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
