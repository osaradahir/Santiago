import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';

function CarruselUpdate() {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [url, setUrl] = useState("");
    const [estado, setEstado] = useState("1");

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const avisoID = searchParams.get('id_aviso');

    useEffect(() => {
        if (avisoID) {
            fetch(`http://localhost:8000/aviso/${avisoID}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Datos del aviso:', data);
                    const avisoData = data[0]; // Tomamos el primer objeto de la lista
                    setFileName(avisoData.imagen); // Establecemos el nombre del archivo en el estado
                    setUrl(avisoData.url); // Establecemos la URL en el estado
                    setEstado(avisoData.estado); // Establecemos el estado en el estado
                })
                .catch(error => console.error('Error al obtener los datos del aviso:', error));
        }
    }, [avisoID]);

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(file.name); // Actualizar el nombre del archivo seleccionado
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'URL') {
            setUrl(value);
        } else if (name === 'estado') {
            setEstado(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Por favor, selecciona un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('url', url);
        formData.append('estado', estado);

        try {
            const response = await fetch(`http://localhost:8000/aviso/editar/${avisoID}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Archivo subido exitosamente: ${data.filename}`);
                window.location.href = '/pagina/carrusel';
            } else {
                const errorData = await response.json();
                alert(`Error al subir el archivo: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            alert('Error al subir el archivo.');
        }
    };

    const handleInvalidInput = () => {
        alert('¡Recuerda cambiar la imagen!');
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Edita la Imagen para el Carrusel</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <button type="button" className="fs-2 border-bottom-only no-rounded" onClick={handleFileInputClick} style={{width:"100%"}}>
                            Seleccionar archivo
                        </button>
                        <span className="fs-2 border-bottom-only no-rounded">{fileName ? fileName : "Nombre de la foto"}</span>
                        <input
                            type="file"
                            id="carrusel"
                            name="carrusel"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            className="fs-2 border-bottom-only no-rounded"
                            onChange={handleFileChange}
                            accept=".png, .jpg, .jpeg" 
                            onInvalid={handleInvalidInput}  // Manejar el evento invalid directamente
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="text"
                            className="form-control fs-2 border-bottom-only no-rounded"
                            id="URL"
                            name="URL"
                            placeholder="URL"
                            value={url ? url : "URL"}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="estado"
                            name="estado"
                            className="fs-2 border-bottom-only no-rounded"
                            value={estado}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/pagina/carrusel" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default CarruselUpdate;
