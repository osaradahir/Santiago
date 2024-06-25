import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import {host} from '../../conexion';

function EventoUpdate(){
    const [newEvent, setNewEvent] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: '', 
        imagen:''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const eventoID = searchParams.get('id_evento');

    useEffect(() => {
        if (eventoID) {
            fetch(`${host}evento/${eventoID}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const eventData = data[0]; // Tomamos el primer objeto de la lista
                        setNewEvent({
                            titulo: eventData.titulo,
                            descripcion: eventData.descripcion,
                            fecha: eventData.fecha,
                            hora: eventData.hora,
                            imagen: eventData.imagen

                        }); setFileName(eventData.imagen);
                    } else {
                        console.error('No se encontraron datos de evento');
                    }
                })
                .catch(error => console.error('Error al obtener los datos del evento:', error));
        }
    }, [eventoID]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewEvent({
            ...newEvent,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('titulo', newEvent.titulo);
        formData.append('descripcion', newEvent.descripcion);
        formData.append('fecha', newEvent.fecha);
        formData.append('hora', newEvent.hora);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        fetch(`${host}evento/editar/${eventoID}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al editar el evento');
            }
            return response.json();
        })
        .then(() => {
            alert('Evento actualizado correctamente');
            window.location.href = '/eventos';
        })
        .catch(error => {
            console.error('Error al editar el evento:', error);
        });
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa un nuevo Evento</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Nombre"
                            value={newEvent.titulo}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Descripción"
                            value={newEvent.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newEvent.fecha}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="time"
                            id="hora"
                            name="hora"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newEvent.hora}
                            onChange={handleInputChange}
                            required
                            pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]" // Establece el patrón para un formato de hora de 24 horas

                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <button type="button" className="fs-2 border-bottom-only no-rounded" onClick={handleFileInputClick} style={{ width: "100%" }}>
                                Seleccionar una foto
                            </button>
                            <span className="fs-2 border-bottom-only no-rounded">{fileName.length > 15 ? `${fileName.substring(0, 15)}...` : fileName}</span>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                className="fs-2 border-bottom-only no-rounded"
                                onChange={handleFileChange}
                                accept=".png, .jpg, .jpeg"
                            />
                        </div>
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/eventos" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default EventoUpdate;