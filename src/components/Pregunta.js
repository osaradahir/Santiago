import React from 'react';

const Pregunta = ({ pregunta, index, handleInputChange, handleRemovePregunta }) => {
    return (
        <div className="pregunta">
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
                className="fs-2 border-bottom-only no-rounded"
                value={pregunta.tipo}
                onChange={(e) => handleInputChange(e, index)}
                required
            >
                <option value="texto">Texto</option>
                <option value="textarea">Textarea</option>
                <option value="radio">Opción Múltiple (Radio)</option>
                <option value="checkbox">Opción Múltiple (Checkbox)</option>
            </select>
            <button type="button" onClick={() => handleRemovePregunta(index)}>Eliminar Pregunta</button>
        </div>
    );
};

export default Pregunta;
