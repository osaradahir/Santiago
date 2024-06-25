import React, { useState } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import Pregunta from '../../components/Pregunta';
import '../../css/surveys/Encuestas.css';
import { Link } from 'react-router-dom';
import { host } from '../../conexion';

function EncuestaInsert() {
    const [encuesta, setEncuesta] = useState({
        titulo: '',
        preguntas: [{ texto: '', tipo: 'text', opciones: [] }]
    });

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPreguntas = [...encuesta.preguntas];
        updatedPreguntas[index][name] = value;
        if (name === 'tipo' && (value === 'radio' || value === 'checkbox')) {
            updatedPreguntas[index].opciones = [''];
        } else if (name === 'tipo' && value === 'text') {
            updatedPreguntas[index].opciones = [];
        }
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleAddPregunta = () => {
        if (encuesta.preguntas.length < 15) {
            setEncuesta({
                ...encuesta,
                preguntas: [...encuesta.preguntas, { texto: '', tipo: 'text', opciones: [] }]
            });
        } else {
            alert("No se pueden agregar más de 15 preguntas.");
        }
    };

    const handleRemovePregunta = (index) => {
        const updatedPreguntas = encuesta.preguntas.filter((_, i) => i !== index);
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Crear la encuesta y obtener el ID
            const encuestaData = await fetchEncuestaData();
            if (!encuestaData || !encuestaData.id) {
                throw new Error('No se recibió el ID de la encuesta correctamente.');
            }
            console.log('ID de la encuesta creada:', encuestaData.id);

            // Crear las preguntas relacionadas con la encuesta
            for (const pregunta of encuesta.preguntas) {
                console.log(`Tipo de pregunta: ${pregunta.tipo}`);
                const preguntaData = await fetchPreguntaData(encuestaData.id, pregunta);
                console.log('Pregunta creada:', preguntaData);

                // Si la pregunta es de tipo 'radio' o 'checkbox', crear las opciones correspondientes
                if (pregunta.tipo === 'radio' || pregunta.tipo === 'checkbox') {
                    for (const opcion of pregunta.opciones) {
                        await fetchOpcionData(preguntaData.id_pregunta, encuestaData.id, opcion);
                    }
                }
            }

            // Redirigir a la página de encuestas después de guardar
            window.location.href = '/encuestas';
            alert('Tu encuesta se creó correctamente');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const fetchEncuestaData = async () => {
        const encuestaResponse = await fetch(`${host}encuesta/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: encuesta.titulo
            })
        });

        if (!encuestaResponse.ok) {
            const errorData = await encuestaResponse.json();
            console.error('Error al crear la encuesta:', errorData);
            throw new Error('Error al crear la encuesta');
        }

        const data = await encuestaResponse.json();
        console.log('Respuesta de creación de encuesta:', data);
        return data;
    };

    const fetchPreguntaData = async (idEncuesta, pregunta) => {
        if (!idEncuesta || !pregunta.texto || !pregunta.tipo) {
            console.error('Datos de pregunta inválidos:', idEncuesta, pregunta);
            throw new Error('Datos de pregunta inválidos');
        }

        console.log(`Enviando pregunta para la encuesta ID ${idEncuesta}:`, pregunta);

        const preguntaResponse = await fetch(`${host}pregunta/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_encuesta: idEncuesta,
                pregunta: pregunta.texto,
                tipo: pregunta.tipo
            })
        });

        if (!preguntaResponse.ok) {
            const errorData = await preguntaResponse.json();
            console.error('Error al crear la pregunta:', errorData);
            throw new Error('Error al crear la pregunta');
        }

        const responseData = await preguntaResponse.json();
        console.log('Respuesta del servidor para crear pregunta:', responseData);

        return responseData;
    };

    const fetchOpcionData = async (idPregunta, idEncuesta, opcion) => {
        console.log(`Enviando opción para la pregunta ID ${idPregunta} en la encuesta ID ${idEncuesta}: ${opcion}`);
        const opcionResponse = await fetch(`${host}opcion/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_pregunta: idPregunta,
                id_encuesta: idEncuesta,
                opcion
            })
        });

        if (!opcionResponse.ok) {
            const errorData = await opcionResponse.json();
            console.error('Error al crear la opción:', errorData);
            throw new Error('Error al crear la opción');
        }

        const data = await opcionResponse.json();
        console.log('Respuesta del servidor para crear opción:', data);
        return data;
    };

    const handleOptionChange = (e, preguntaIndex, opcionIndex) => {
        const updatedPreguntas = [...encuesta.preguntas];
        updatedPreguntas[preguntaIndex].opciones[opcionIndex] = e.target.value;
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleAddOption = (index) => {
        const updatedPreguntas = [...encuesta.preguntas];
        if (!Array.isArray(updatedPreguntas[index].opciones)) {
            updatedPreguntas[index].opciones = [];
        }
        updatedPreguntas[index].opciones.push('');
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleRemoveOption = (index, optionIndex) => {
        const updatedPreguntas = [...encuesta.preguntas];
        if (Array.isArray(updatedPreguntas[index].opciones)) {
            updatedPreguntas[index].opciones.splice(optionIndex, 1);
            setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Crear Encuesta</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
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
                
                <div id="preguntas-container" className={`d-flex flex-column align-items-center ${encuesta.preguntas.length > 1 ? 'scrollable' : ''}`}>
                    {encuesta.preguntas.map((pregunta, index) => (
                        <Pregunta
                            key={index}
                            index={index}
                            pregunta={pregunta}
                            handleInputChange={handleInputChange}
                            handleRemovePregunta={handleRemovePregunta}
                            handleOptionChange={handleOptionChange}
                            handleAddOption={handleAddOption}
                            handleRemoveOption={handleRemoveOption}
                        />
                    ))}
                </div>
                <div className="d-flex justify-content-center mt-2 w-100">
                    <button type="button" onClick={handleAddPregunta} className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton_01">Agregar Pregunta</button>
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5 mt-3">
                    <Link to="/encuestas" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default EncuestaInsert;
