import React from 'react';

const Pregunta = ({ pregunta, index, handleInputChange, handleRemovePregunta, handleOptionChange, handleAddOption, handleRemoveOption }) => {
    return (
        <div className="d-flex flex-column align-items-center w-100">
            <div className="d-flex flex-row align-items-center w-100">
                <div className="d-flex flex-column flex-grow-1">
                    <input
                        type="text"
                        placeholder={`Pregunta ${index + 1}`}
                        value={pregunta.texto}
                        className="fs-2 border-bottom-only no-rounded"
                        onChange={(e) => handleInputChange(e, index)}
                        name="texto"
                        required
                    />
                    <select
                        name="tipo"
                        className="fs-2 border-bottom-only no-rounded mt-2"
                        value={pregunta.tipo}
                        onChange={(e) => handleInputChange(e, index)}
                        required
                    >
                        <option value="texto">Texto</option>
                        <option value="radio">Opción Múltiple (Radio)</option>
                    </select>
                </div>
                <button
                    type="button"
                    className='btn btn-outline-dark fs-4 btn-lg rounded-pill boton ml-2'
                    onClick={() => handleRemovePregunta(index)}
                >
                    -
                </button>
            </div>
            {pregunta.tipo === 'radio' && Array.isArray(pregunta.opciones) && (
                <div className="mt-3 w-100">
                    {pregunta.opciones.map((opcion, i) => (
                        <div key={i} className="d-flex flex-row align-items-center mb-2">
                            <input
                                type="text"
                                placeholder={`Opción ${i + 1}`}
                                value={opcion}
                                className="fs-2 border-bottom-only no-rounded flex-grow-1"
                                onChange={(e) => handleOptionChange(e, index, i)}
                                required
                            />
                            {i > 0 && (
                                <button
                                    type="button"
                                    className='btn btn-outline-dark fs-4 btn-lg rounded-pill boton ml-2'
                                    onClick={() => handleRemoveOption(index, i)}
                                >
                                    -
                                </button>
                            )}
                        </div>
                    ))}
                    {pregunta.opciones.length < 4 && (
                        <button
                            type="button"
                            className='btn btn-outline-dark fs-4 btn-lg rounded-pill boton_01 mt-2'
                            onClick={() => handleAddOption(index)}
                        >
                            Agregar Opción
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Pregunta;
