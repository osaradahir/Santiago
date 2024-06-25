import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import {host} from '../../conexion';

function NoticiaInsert() {
    const [newNoticia, setNewNoticia] = useState({
        titulo: '',
        contenido: '',
        imagen: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);
    
    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(file.name);
    };

    const handleChange = (event) => {
        setNewNoticia({
            ...newNoticia,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('titulo', newNoticia.titulo);
        formData.append('contenido', newNoticia.contenido);
        if (selectedFile) {
            formData.append('file', selectedFile); // Cambiar el nombre del campo a 'file'
        }

        try {
                const response = await fetch(`${host}noticia/crear`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewNoticia({
                titulo: '',
                contenido: '',
                imagen: ''
            });
            setSelectedFile(null);
            setFileName("");
            window.location.href = '/noticias';
            alert('Noticia creada exitosamente');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa una nueva Noticia</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Titulo"
                            value={newNoticia.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <button type="button" className="fs-2 border-bottom-only no-rounded" onClick={handleFileInputClick} style={{ width: "100%" }}>
                            Seleccionar archivo
                        </button>
                        <span className="fs-2 border-bottom-only no-rounded">{fileName.length > 15 ? `${fileName.substring(0, 15)}...` : fileName}</span>
                        <input
                            type="file"
                            id="imagen"
                            name="imagen"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            className="fs-2 border-bottom-only no-rounded"
                            onChange={handleFileChange}
                            accept=".png, .jpg, .jpeg"
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <textarea
                            id="contenido"
                            name="contenido"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Escribe tu noticia aquí..."
                            value={newNoticia.contenido}
                            onChange={handleChange}
                            style={{ width: "100%" }}
                            required
                        />
                    </div>
                    
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/noticias" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default NoticiaInsert;
