import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import { CreateIcon, UpdateIcon, DeleteIcon, Export } from '../../components/Icons';
import { host } from '../../conexion';
import ExcelJS from 'exceljs';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar CSS de Bootstrap

function Encuestas() {
    const [datosEncuestas, setDatosEncuestas] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false); // Estado para el spinner
    const [excelUrl, setExcelUrl] = useState(null); // Estado para el URL del archivo Excel

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}encuesta`);
                const data = await response.json();
                setDatosEncuestas(data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (excelUrl) {
            // Crear un enlace temporal y simular el clic para iniciar la descarga
            const a = document.createElement('a');
            a.href = excelUrl;
            a.download = `Encuesta ${selectedId}.xlsx`;
            a.click();

            // Limpiar el URL después de la descarga
            URL.revokeObjectURL(excelUrl);
            setExcelUrl(null);
        }
    }, [excelUrl, selectedId]);

    const handleRowClick = (id_encuesta) => {
        setSelectedId(id_encuesta);
        console.log("ID de la encuesta seleccionado:", id_encuesta);
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
                    const updatedEncuestas = datosEncuestas.filter(encuesta => encuesta.id_encuesta !== selectedId);
                    setDatosEncuestas(updatedEncuestas);
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

    const handleExportToExcel = async () => {
        if (!selectedId) {
            alert('Por favor, selecciona una encuesta para exportar.');
            return;
        }
    
        setLoading(true);
    
        try {
            const encuestaResponse = await fetch(`${host}buscador_encuesta/${selectedId}`);
            const encuestaData = await encuestaResponse.json();
    
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Encuesta');
    
            // Agregar título de la encuesta
            sheet.addRow([`Encuesta: ${encuestaData.titulo}`]);
            sheet.addRow([]);

            // Agregar preguntas y respuestas
            for (const pregunta of encuestaData.preguntas) {
                sheet.addRow([`Pregunta: ${pregunta.pregunta}`]);
    
                if (pregunta.tipo === 'text') {
                    const respuestasAbiertasResponse = await fetch(`${host}respuesta_abierta/${selectedId}/${pregunta.id_pregunta}`);
                    const respuestasAbiertas = await respuestasAbiertasResponse.json();
    
                    if (respuestasAbiertas.length > 0) {
                        sheet.addRow(['Respuestas abiertas:']);
                        respuestasAbiertas.forEach(respuesta => {
                            sheet.addRow([respuesta.respuesta]);
                        });
                    }
    
                } else if (pregunta.tipo === 'radio' || pregunta.tipo === 'checkbox') {
                    // Añadir encabezado para las opciones y los totales
                    sheet.addRow(['Opción', 'Totales']);

                    for (const opcion of pregunta.opciones) {
                        const detalleOpcionResponse = await fetch(`${host}respuesta_cerrada/${selectedId}/${pregunta.id_pregunta}/${opcion.id_opcion}`);
                        const detalleOpcion = await detalleOpcionResponse.json();
    
                        // Agregar detalle al archivo Excel
                        sheet.addRow([opcion.opcion, detalleOpcion.total_respuestas]);
                    }
                }
    
                sheet.addRow([]); // Separador entre preguntas
            }
    
            // Guardar el archivo Excel
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            setExcelUrl(url); // Actualizar el estado con el URL del blob
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
        } finally {
            setLoading(false);
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
                                style={{ color: "#04703F" }}
                            />
                        </div>
                        <Link to="/encuesta/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/encuesta/actualizar?id_encuesta=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{ backgroundColor: "white", border: "none" }} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>
                        <button type="button" className="text-decoration-none px-2" style={{ backgroundColor: "white", border: "none" }} onClick={handleExportToExcel}>
                            <Export />
                        </button>
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
                                <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F" }}>{encuesta.titulo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {loading && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <strong className="ms-2">Cargando...</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Encuestas;
