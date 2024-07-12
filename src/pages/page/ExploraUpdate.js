import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function ExploraUpdate() {
    const [newSitio, setNewSitio] = useState({
        nombre_sitio: '',
        descripcion: '',
        categoria: '',
        imagen: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sitioID = searchParams.get('id_explora');

    useEffect(() => {
        fetch(`${host}explora/${sitioID}`)
            .then(response => response.json())
            .then(data => {
                const sitio = data;  // Assuming the API returns an object
                console.log(sitio);  // Verify the received data
                setNewSitio({
                    nombre_sitio: sitio.nombre_sitio,
                    descripcion: sitio.descripcion,
                    categoria: sitio.categoria,
                    imagen: sitio.imagen
                });
                setFileName(sitio.imagen);
            });
    }, [sitioID]);

    const handleChange = (e) => {
        setNewSitio({
            ...newSitio,
            [e.target.name]: e.target.value
        });
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nombre_sitio', newSitio.nombre_sitio);
            formData.append('descripcion', newSitio.descripcion);
            formData.append('categoria', newSitio.categoria);
            if (selectedFile) {
                formData.append('imagen', selectedFile);
            } else {
                formData.append('imagen', newSitio.imagen); // Use the existing image
            }

            const response = await fetch(`${host}explora/editar/${sitioID}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert('Sitio actualizado exitosamente');
                window.location.href = '/pagina/explora';
            } else {
                throw new Error('Error al actualizar el sitio');
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Actualizar Información del Sitio</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "-33px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type='text'
                                id="nombre_sitio"
                                name="nombre_sitio"
                                placeholder="Nombre del Sitio"
                                className="fs-2 border-bottom-only no-rounded"
                                value={newSitio.nombre_sitio}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type='text'
                                id="descripcion"
                                name="descripcion"
                                placeholder="Descripción"
                                className="fs-2 border-bottom-only no-rounded"
                                value={newSitio.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <select
                                id="categoria"
                                name="categoria"
                                className="form-control fs-2 border-bottom-only no-rounded"
                                value={newSitio.categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar Categoría</option>
                                <option value="Salud y Bienestar">Salud y Bienestar</option>
                                <option value="Turismo">Turismo</option>
                                <option value="Cultura">Cultura</option>
                                <option value="Gastronomia">Gastronomía</option>
                                <option value="Vida e Inclusion">Vida e Inclusión</option>
                                {/* Agrega más opciones según tus necesidades */}
                            </select>
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

export default ExploraUpdate;
