import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/events/Eventos.css';
import CustomNavbar from '../../components/CustomNavbar';


function EventoInsert() {
    const [newEvent, setNewEvent] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({
            ...newEvent,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/evento/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            // Limpiar el formulario después de enviar los datos
            setNewEvent({
                titulo: '',
                descripcion: '',
                fecha: '',
                hora: ''
            });
            window.location.href = '/eventos';
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
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

export default EventoInsert;
