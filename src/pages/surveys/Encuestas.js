import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import Pregunta from '../../components/Pregunta';

function EncuestaInsert() {
    const [encuesta, setEncuesta] = useState({
        titulo: '',
        descripcion: '',
        preguntas: [{ texto: '', tipo: 'texto' }]
    });

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPreguntas = [...encuesta.preguntas];
        updatedPreguntas[index][name] = value;
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleAddPregunta = () => {
        setEncuesta({
            ...encuesta,
            preguntas: [...encuesta.preguntas, { texto: '', tipo: 'texto' }]
        });
    };

    const handleRemovePregunta = (index) => {
        const updatedPreguntas = encuesta.preguntas.filter((_, i) => i !== index);
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/encuesta/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(encuesta)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            // Limpiar el formulario después de enviar los datos
            setEncuesta({
                titulo: '',
                descripcion: '',
                preguntas: [{ texto: '', tipo: 'texto' }]
            });
            window.location.href = '/encuestas';
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Crear Encuesta</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Título de la encuesta"
                            value={encuesta.titulo}
                            onChange={(e) => setEncuesta({ ...encuesta, titulo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Descripción de la encuesta"
                            value={encuesta.descripcion}
                            onChange={(e) => setEncuesta({ ...encuesta, descripcion: e.target.value })}
                            required
                        />
                    </div>
                   <div className="form-group d-flex py-2 w-100 justify-content-center">
                        {encuesta.preguntas.map((pregunta, index) => (
                            <Pregunta
                                key={index}
                                index={index}
                                pregunta={pregunta}
                                handleInputChange={handleInputChange}
                                handleRemovePregunta={handleRemovePregunta}
                            />
                        ))}
                    </div>
                    <button type="button" onClick={handleAddPregunta}>Agregar Pregunta</button>
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/encuestas" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default EncuestaInsert;
