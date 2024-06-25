import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function ExpresidenteUpdate() {
    const [expresidente, setExpresidente] = useState({
        nombre_expresidente: '',
        periodo: '',
        imagen: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const expresidenteID = searchParams.get('id_expresidente');

    useEffect(() => {
        fetch(`${host}expresidente/${expresidenteID}`)
            .then(response => response.json())
            .then(data => {
                const expresidente = data[0];  // Asumiendo que el array siempre contiene un objeto
                setExpresidente({
                    nombre_expresidente: expresidente.nombre_expresidente,
                    periodo: expresidente.periodo,
                    imagen: expresidente.imagen
                });
                setFileName(expresidente.imagen);
            });
    }, [expresidenteID]);

    const handleChange = (e) => {
        setExpresidente({
            ...expresidente,
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
            formData.append('nombre_expresidente', expresidente.nombre_expresidente);
            formData.append('periodo', expresidente.periodo);
            if (selectedFile) {
                formData.append('imagen', selectedFile); // El campo debe coincidir con el backend
            }

            const response = await fetch(`${host}expresidente/editar/${expresidenteID}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert('Expresidente actualizado exitosamente');
                window.location.href = '/pagina/expresidentes';
            } else {
                throw new Error('Error al actualizar el expresidente');
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Actualizar Expresidente</h1>
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
                                value={expresidente.nombre_expresidente}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type='text'
                                id="periodo"
                                name="periodo"
                                placeholder="Periodo"
                                className="fs-2 border-bottom-only no-rounded"
                                value={expresidente.periodo}
                                onChange={handleChange}
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

export default ExpresidenteUpdate;
