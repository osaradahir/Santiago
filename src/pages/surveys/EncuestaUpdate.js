import React, { useState, useEffect, useCallback } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import Pregunta from '../../components/Pregunta1';
import '../../css/surveys/Encuestas.css';
import { Link, useLocation } from 'react-router-dom';
import { host } from '../../conexion';

function EncuestaUpdate() {
    const [encuesta, setEncuesta] = useState({
        id_encuesta: '',
        titulo: '',
        preguntas: [{ id_pregunta: '', texto: '', tipo: 'text', opciones: [] }]
    });

    const [encuestaOriginal, setEncuestaOriginal] = useState({
        id_encuesta: '',
        titulo: '',
        preguntas: [{ id_pregunta: '', texto: '', tipo: 'text', opciones: [] }]
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const encuestaID = searchParams.get('id_encuesta');

    useEffect(() => {
        if (encuestaID) {
            const fetchEncuesta = async () => {
                try {
                    const response = await fetch(`${host}buscador_encuesta/${encuestaID}`);
                    if (!response.ok) {
                        throw new Error('Error al obtener datos de la encuesta');
                    }
                    const data = await response.json();

                    setEncuesta({
                        id_encuesta: data.id_encuesta,
                        titulo: data.titulo,
                        preguntas: data.preguntas.map(pregunta => ({
                            id_pregunta: pregunta.id_pregunta,
                            texto: pregunta.pregunta,
                            tipo: pregunta.tipo,
                            opciones: pregunta.opciones ? pregunta.opciones.map(opcion => ({
                                id_opcion: opcion.id_opcion,
                                opcion: opcion.opcion
                            })) : []
                        }))
                    });

                    setEncuestaOriginal({
                        id_encuesta: data.id_encuesta,
                        titulo: data.titulo,
                        preguntas: data.preguntas.map(pregunta => ({
                            id_pregunta: pregunta.id_pregunta,
                            texto: pregunta.pregunta,
                            tipo: pregunta.tipo,
                            opciones: pregunta.opciones ? pregunta.opciones.map(opcion => ({
                                id_opcion: opcion.id_opcion,
                                opcion: opcion.opcion
                            })) : []
                        }))
                    });
                } catch (error) {
                    console.error('Error al obtener encuesta:', error);
                }
            };

            fetchEncuesta();
        }
    }, [encuestaID]);

    const handleInputChange = useCallback((e, index) => {
        const { name, value } = e.target;
        setEncuesta(prevEncuesta => {
            const updatedPreguntas = [...prevEncuesta.preguntas];
            
            // Verificar si se está intentando cambiar el tipo de pregunta
            if (name === 'tipo' && value !== updatedPreguntas[index].tipo) {
                alert("No se puede cambiar el tipo de pregunta.");
                return prevEncuesta; // Devolver el estado anterior sin realizar cambios
            }

            updatedPreguntas[index][name] = value;

            // Manejo de las opciones dependiendo del tipo de pregunta
            if (name === 'tipo' && (value === 'radio' || value === 'checkbox')) {
                updatedPreguntas[index].opciones = [{ id_opcion: '', opcion: '' }];
            } else if (name === 'tipo' && value === 'text') {
                updatedPreguntas[index].opciones = [];
            }

            return { ...prevEncuesta, preguntas: updatedPreguntas };
        });
    }, []);

    const handleAddPregunta = () => {
        if (encuesta.preguntas.length < 15) {
            setEncuesta({
                ...encuesta,
                preguntas: [...encuesta.preguntas, { id_pregunta: '', texto: '', tipo: 'text', opciones: [] }]
            });
        } else {
            alert("No se pueden agregar más de 15 preguntas.");
        }
    };

    const handleRemovePregunta = async (index) => {
        const pregunta = encuesta.preguntas[index];
        if (pregunta.id_pregunta) {
            try {
                // Eliminar opciones si existen
                if (pregunta.tipo === 'radio' || pregunta.tipo === 'checkbox') {
                    for (const opcion of pregunta.opciones) {
                        await fetch(`${host}opcion/eliminar/${opcion.id_opcion}`, {
                            method: 'DELETE'
                        });
                    }
                }
                // Eliminar pregunta
                await fetch(`${host}pregunta/borrar/${pregunta.id_pregunta}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Error al eliminar la pregunta:', error);
                return;
            }
        }
        const updatedPreguntas = encuesta.preguntas.filter((_, i) => i !== index);
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleOptionChange = (e, preguntaIndex, opcionIndex) => {
        const updatedPreguntas = [...encuesta.preguntas];
        updatedPreguntas[preguntaIndex].opciones[opcionIndex].opcion = e.target.value;
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleRemoveOption = async (preguntaIndex, opcionIndex) => {
        const pregunta = encuesta.preguntas[preguntaIndex];
        const opcion = pregunta.opciones[opcionIndex];
        if (opcion.id_opcion) {
            try {
                await fetch(`${host}opcion/borrar/${opcion.id_opcion}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Error al eliminar la opción:', error);
                return;
            }
        }
        const updatedPreguntas = [...encuesta.preguntas];
        updatedPreguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleAddOption = (preguntaIndex) => {
        const updatedPreguntas = [...encuesta.preguntas];
        updatedPreguntas[preguntaIndex].opciones.push({ id_opcion: '', opcion: '' });
        setEncuesta({ ...encuesta, preguntas: updatedPreguntas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (encuesta.titulo !== encuestaOriginal.titulo) {
                const response = await fetch(`${host}encuesta/editar/${encuesta.id_encuesta}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        titulo: encuesta.titulo
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el título de la encuesta');
                }
            }

            for (const pregunta of encuesta.preguntas) {
                const preguntaOriginal = encuestaOriginal.preguntas.find(p => p.id_pregunta === pregunta.id_pregunta);

                if (preguntaOriginal) {
                    const cambios = {
                        texto: pregunta.texto !== preguntaOriginal.texto,
                        tipo: pregunta.tipo !== preguntaOriginal.tipo,
                        opciones: JSON.stringify(pregunta.opciones) !== JSON.stringify(preguntaOriginal.opciones)
                    };

                    if (cambios.texto || cambios.tipo || cambios.opciones) {
                        const preguntaData = await fetch(`${host}pregunta/editar/${pregunta.id_pregunta}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id_pregunta: pregunta.id_pregunta,
                                pregunta: pregunta.texto,
                                tipo: pregunta.tipo,
                                id_encuesta: encuesta.id_encuesta
                            })
                        });

                        if (!preguntaData.ok) {
                            throw new Error('Error al actualizar la pregunta');
                        }

                        if (pregunta.tipo === 'radio' || pregunta.tipo === 'checkbox') {
                            for (const opcion of pregunta.opciones) {
                                if (opcion.id_opcion) {
                                    const opcionesData = await fetch(`${host}opcion/editar/${opcion.id_opcion}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            opcion: opcion.opcion
                                        })
                                    });

                                    if (!opcionesData.ok) {
                                        throw new Error('Error al actualizar la opción de la pregunta');
                                    }
                                } else {
                                    const nuevasOpcionesData = await fetch(`${host}opcion/crear`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            id_pregunta: pregunta.id_pregunta,
                                            id_encuesta: encuesta.id_encuesta,
                                            opcion: opcion.opcion
                                        })
                                    });

                                    if (!nuevasOpcionesData.ok) {
                                        throw new Error('Error al crear las opciones de la pregunta');
                                    }
                                }
                            }
                        }
                    }
                } else {
                    const nuevaPreguntaResponse = await fetch(`${host}pregunta/crear`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            pregunta: pregunta.texto,
                            tipo: pregunta.tipo,
                            id_encuesta: encuesta.id_encuesta
                        })
                    });

                    if (!nuevaPreguntaResponse.ok) {
                        throw new Error('Error al crear la nueva pregunta');
                    }

                    const nuevaPreguntaData = await nuevaPreguntaResponse.json();
                    if (pregunta.tipo === 'radio' || pregunta.tipo === 'checkbox') {
                        for (const opcion of pregunta.opciones) {
                            const nuevaOpcionResponse = await fetch(`${host}opcion/crear`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id_pregunta: nuevaPreguntaData.id_pregunta,
                                    id_encuesta: encuesta.id_encuesta,
                                    opcion: opcion.opcion
                                })
                            });

                            if (!nuevaOpcionResponse.ok) {
                                throw new Error('Error al crear la nueva opción');
                            }
                        }
                    }
                }
            }
            window.location.href = '/encuestas';
            alert('Encuesta Actualizada');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
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
