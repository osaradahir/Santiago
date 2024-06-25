import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function ExpresidenteInsert() {
    const [newExpresidente, setNewExpresidente] = useState({
        nombre_expresidente: '',
        periodo: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpresidente({
            ...newExpresidente,
            [name]: value
        });
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(file.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nombre_expresidente', newExpresidente.nombre_expresidente);
            formData.append('periodo', newExpresidente.periodo);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await fetch(`${host}expresidente/crear`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            // Limpiar el formulario después de enviar los datos
            setNewExpresidente({
                nombre_expresidente: '',
                periodo: ''
            });
            setSelectedFile(null);
            setFileName('');
            window.location.href = '/pagina/expresidentes';
            alert('Expresidente registrado con éxito.');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Hubo un error al registrar el expresidente. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Ingresa un nuevo Expresidente</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type='text'
                                id="nombre_expresidente"
                                name="nombre_expresidente"
                                placeholder="Nombre Completo"
                                className="fs-2 border-bottom-only no-rounded"
                                value={newExpresidente.nombre_expresidente}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type='text'
                                id="periodo"
                                name="periodo"
                                placeholder="Periodo ejemplo: 2020 - 2024"
                                className="fs-2 border-bottom-only no-rounded"
                                value={newExpresidente.periodo}
                                onChange={handleInputChange}
                                required
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
                                required
                            />
                        </div>
                    </div>
                    <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                        <Link to="/pagina/expresidentes" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ExpresidenteInsert;
