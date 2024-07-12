import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function ExploraInsert() {
    const [newExplora, setNewExplora] = useState({
        nombre_sitio: '',
        descripcion: '',
        categoria: '', // Nuevo estado para la categoría
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExplora({
            ...newExplora,
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

    const handleCategoriaChange = (e) => {
        setNewExplora({
            ...newExplora,
            categoria: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verificar si el nombre del sitio está en la tabla de ubicaciones
            const responseUbicacion = await fetch(`${host}ubicacion-buscar/${newExplora.nombre_sitio}`);
            if (!responseUbicacion.ok) {
                // Si no está en la tabla de ubicaciones, mostrar alerta y salir
                alert("Primero debes crear una ubicación en la página de mapa.");
                return;
            }

            // Si el nombre del sitio está en la tabla de ubicaciones, continuar con la creación del sitio
            const formData = new FormData();
            formData.append('nombre_sitio', newExplora.nombre_sitio);
            formData.append('descripcion', newExplora.descripcion);
            formData.append('categoria', newExplora.categoria); // Agregar categoría al FormData
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await fetch(`${host}explora/crear`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            // Limpiar el formulario después de enviar los datos
            setNewExplora({
                nombre_sitio: '',
                descripcion: '',
                categoria: '', // Limpiar también la categoría
            });
            setSelectedFile(null);
            setFileName('');
            window.location.href = '/pagina/explora';
            alert('Sitio creado con éxito.');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert(error.message);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Ingresa un nuevo sitio en Explora</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type='text'
                                id="nombre_sitio"
                                name="nombre_sitio"
                                placeholder="Nombre del Sitio"
                                className="fs-2 border-bottom-only no-rounded"
                                value={newExplora.nombre_sitio}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                id="descripcion"
                                type="text"
                                name="descripcion"
                                placeholder="Descripción"
                                className="fs-2 border-bottom-only no-rounded"
                                value={newExplora.descripcion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <select
                                id="categoria"
                                name="categoria"
                                className="form-control fs-2 border-bottom-only no-rounded"
                                value={newExplora.categoria}
                                onChange={handleCategoriaChange}
                                required
                            >
                                <option value="">Seleccionar Categoría</option>
                                <option value="Salud y Bienestar">Salud y Bienestar</option>
                                <option value="Turismo">Turismo</option>
                                <option value="Cultura">Cultura</option>
                                <option value="Gastronomia">Gastronomía</option>
                                <option value="Vida e Inclusion">Vida e Inclusion</option>

                                {/* Agrega más opciones según tus necesidades */}
                            </select>
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <button type="button" className="fs-2 border-bottom-only no-rounded" onClick={handleFileInputClick} style={{ width: "100%" }}>
                                Seleccionar una imagen
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
                        <Link to="/pagina/explora" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ExploraInsert;
