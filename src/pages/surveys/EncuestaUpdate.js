import React, { useState } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import Pregunta from '../../components/Pregunta';
import '../../css/surveys/Encuestas.css';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {host} from '../../conexion';

function EncuestaUpdate() {
    const [encuesta, setEncuesta] = useState({
        titulo: '',
        preguntas: [{ id: '', texto: '', tipo: 'texto', opciones: [] }]
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const encuestaID = searchParams.get('id_encuesta');

    useEffect(() => {
        if (encuestaID) {
            obtenerTituloEncuesta(encuestaID);
        }
    }, [encuestaID]);

    const obtenerTituloEncuesta = async (idEncuesta) => {
        try {
            const encuestaResponse = await fetch(`${host}encuesta/${idEncuesta}`);
            if (!encuestaResponse.ok) {
                throw new Error('Error al obtener datos de la encuesta');
            }
            const data = await encuestaResponse.json();
            console.log('Datos de la encuesta:', data);
            setEncuesta(prevEncuesta => ({ ...prevEncuesta, titulo: data.titulo }));
            obtenerPreguntasEncuesta(idEncuesta);
        } catch (error) {
            console.error('Error al obtener datos de la encuesta:', error);
        }
    };

    const obtenerPreguntasEncuesta = async (idEncuesta) => {
        try {
            const preguntasResponse = await fetch(`${host}preguntas/encuesta/${idEncuesta}`);
            if (!preguntasResponse.ok) {
                throw new Error('Error al obtener preguntas de la encuesta');
            }
            const data = await preguntasResponse.json();
            console.log('Preguntas de la encuesta:', data);
            setEncuesta(prevEncuesta => ({
                ...prevEncuesta,
                preguntas: data.map(pregunta => ({
                    id: pregunta.id,
                    texto: pregunta.texto,
                    tipo: pregunta.tipo,
                    opciones: []
                }))
            }));
            obtenerOpcionesPreguntas(data);
        } catch (error) {
            console.error('Error al obtener preguntas de la encuesta:', error);
        }
    };

    const obtenerOpcionesPreguntas = async (preguntas) => {
        try {
            const opcionesPromises = preguntas.map(pregunta =>
                fetch(`${host}opciones/preguntas/${pregunta.id}`)
            );
            const opcionesResponses = await Promise.all(opcionesPromises);
            const opcionesData = await Promise.all(opcionesResponses.map(response => response.json()));
            console.log('Opciones de las preguntas:', opcionesData);
            setEncuesta(prevEncuesta => ({
                ...prevEncuesta,
                preguntas: prevEncuesta.preguntas.map((pregunta, index) => ({
                    ...pregunta,
                    opciones: opcionesData[index].map(opcion => opcion.texto)
                }))
            }));
        } catch (error) {
            console.error('Error al obtener opciones de las preguntas:', error);
        }
    };


    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPreguntas = [...encuesta.preguntas];
        updatedPreguntas[index][name] = value;
        if (name === 'tipo' && value === 'radio') {
            updatedPreguntas[index].opciones = [''];
        }
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleAddPregunta = () => {
        if (encuesta.preguntas.length < 15) {
            setEncuesta({
                ...encuesta,
                preguntas: [...encuesta.preguntas, { texto: '', tipo: 'texto', opciones: [] }]
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
            console.log('ID de la encuesta creada:', encuestaData.id_encuesta);

            // Crear las preguntas relacionadas con la encuesta
            for (const pregunta of encuesta.preguntas) {
                const preguntaData = await fetchPreguntaData(encuestaData.id_encuesta, pregunta);
                console.log('Pregunta creada:', preguntaData);

                // Si la pregunta es de tipo 'radio', crear las opciones correspondientes
                if (pregunta.tipo === 'radio') {
                    for (const opcion of pregunta.opciones) {
                        await fetchOpcionData(preguntaData.id_pregunta, encuestaData.id_encuesta, opcion);
                    }
                }
            }

            // Redirigir a la página de encuestas después de guardar
            window.location.href = '/encuestas';
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const fetchEncuestaData = async () => {
        const encuestaResponse = await fetch(`${host}encuesta/editar/${idEncuesta}`, {
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
            throw new Error('Datos de pregunta inválidos');
        }

        console.log(`Enviando pregunta para la encuesta ID ${idEncuesta}:`, pregunta);

        const preguntaResponse = await fetch(`${host}pregunta/ediar/${idPegunta}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_encuesta: idEncuesta,
                pregunta: pregunta.texto,
                pregunta_abierta: pregunta.tipo === 'texto' ? '1' : '0',
                pregunta_cerrada_multiple: pregunta.tipo === 'radio' ? '1' : '0'
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
        const opcionResponse = await fetch(`${host}opcion/editar/${idPregunta}`, {
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
                <h1 className="fs-1">Edita tu Encuesta</h1>
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

export default EncuestaUpdate;
