import React from 'react';

const Pregunta = ({
    pregunta,
    index,
    handleInputChange,
    handleRemovePregunta,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption
}) => {
    return (
        <div className="d-flex flex-column align-items-center w-100">
            <div className="d-flex flex-row align-items-center w-100">
                <div className="d-flex flex-column flex-grow-1">
                    <input
                        type="text"
                        placeholder={`Pregunta ${index + 1}`}
                        value={pregunta.texto}
                        className="fs-2 border-bottom-only no-rounded form-control"
                        onChange={(e) => handleInputChange(e, index)}
                        name="texto"
                        required
                    />
                    <select
                        value={pregunta.tipo}
                        className="fs-4 border-bottom-only no-rounded mt-2 form-control"
                        onChange={(e) => handleInputChange(e, index)}
                        name="tipo"
                    >
                        <option value="text">Texto</option>
                        <option value="radio">Opción múltiple (radio)</option>
                        <option value="checkbox">Opción múltiple (checkbox)</option>
                    </select>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => handleRemovePregunta(index)}
                        className="btn btn-outline-danger fs-4 btn-sm rounded-pill"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
            {(pregunta.tipo === 'radio' || pregunta.tipo === 'checkbox') && (
                <div className="d-flex flex-column align-items-start mt-3 w-100">
                    {pregunta.opciones.map((opcion, opcionIndex) => (
                        <div key={opcionIndex} className="d-flex flex-row align-items-center w-100 mb-2">
                            <input
                                type="text"
                                placeholder={`Opción ${opcionIndex + 1}`}
                                value={opcion.opcion}
                                className="fs-4 border-bottom-only no-rounded flex-grow-1 form-control"
                                onChange={(e) => handleOptionChange(e, index, opcionIndex)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index, opcionIndex)}
                                className="btn btn-outline-danger fs-4 btn-sm rounded-pill ml-2"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddOption(index)}
                        className="btn btn-outline-dark fs-4 btn-sm rounded-pill agregar"
                    >
                        Agregar Opción
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pregunta;
