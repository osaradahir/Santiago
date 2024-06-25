import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function InstitucionUpdate() {
    const [newInstitucion, setNewInstitucion] = useState({
        nombre_institucion: '',
        telefono: '',
        email: '',
        facebook: '',
        x: '',
        youtube: '',
        imagen: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const institucionID = searchParams.get('id_contacto');

    useEffect(() => {
        fetch(`${host}contacto/${institucionID}`)
        .then(response => response.json())
        .then(data => {
            const institucion = data[0];  // Asumiendo que el array siempre contiene un objeto
            console.log(institucion);  // Verificar los datos recibidos
            setNewInstitucion({
                nombre_institucion: institucion.nombre_institucion,
                telefono: institucion.telefono,
                email: institucion.email,
                facebook: institucion.facebook,
                x: institucion.x,
                youtube: institucion.youtube,
                imagen: institucion.imagen
            }); 
            setFileName(institucion.imagen); 
        });
    }, [institucionID]);

    const handleChange = (e) => {
        setNewInstitucion({
            ...newInstitucion,
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
            formData.append('nombre_institucion', newInstitucion.nombre_institucion);
            formData.append('telefono', newInstitucion.telefono);
            formData.append('email', newInstitucion.email);
            formData.append('facebook', newInstitucion.facebook);
            formData.append('x', newInstitucion.x);
            formData.append('youtube', newInstitucion.youtube);
            if (selectedFile) {
                formData.append('imagen', selectedFile);
            } else {
                formData.append('imagen', newInstitucion.imagen); // Usar la imagen existente
            }

            const response = await fetch(`${host}contacto/editar/${institucionID}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert('Institución actualizada exitosamente');
                window.location.href = '/pagina/contactos/institucinal';
            } else {
                throw new Error('Error al actualizar la institución');
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Actualizar Información de Institución</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "-33px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type='text'
                            id="nombre_institucion"
                            name="nombre_institucion"
                            placeholder="Nombre de la Institución"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newInstitucion.nombre_institucion}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            id="telefono"
                            name="telefono"
                            type='tel'
                            placeholder="Telefono"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newInstitucion.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            id="email"
                            name="email"
                            type='email'
                            placeholder="Correo"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newInstitucion.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            id="facebook"
                            name="facebook"
                            type='text'
                            placeholder="URL Facebook"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newInstitucion.facebook}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            id="x"
                            name="x"
                            type='text'
                            placeholder="URL X"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newInstitucion.x}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            id="youtube"
                            name="youtube"
                            type='text'
                            placeholder="URL Youtube"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newInstitucion.youtube}
                            onChange={handleChange}
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
                    <Link to="/pagina/contactos/institucinal" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default InstitucionUpdate;
