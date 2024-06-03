import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';

function EventoUpdate(){
    const [newEvent, setNewEvent] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: ''
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const eventoID = searchParams.get('id_evento');

    useEffect(() => {
        if (eventoID) {
            fetch(`http://localhost:8000/evento/${eventoID}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const eventData = data[0]; // Tomamos el primer objeto de la lista
                        setNewEvent({
                            titulo: eventData.titulo,
                            descripcion: eventData.descripcion,
                            fecha: eventData.fecha,
                            hora: eventData.hora
                        });
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

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/evento/editar/${eventoID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
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