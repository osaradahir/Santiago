import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function FuncionarioUpdate() {
    const [newFuncionario, setNewFuncionario] = useState({
        nombre_funcionario: '',
        puesto: '',
        institucion: '',
        telefono: '',
        correo: '',
        imagen: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const funcionariID = searchParams.get('id_funcionario');

    useEffect(() => {
        fetch(`${host}funcionario/${funcionariID}`)
        .then(response => response.json())
        .then(data => {
            const funcionario = data[0];  // Asumiendo que el array siempre contiene un objeto
            console.log(funcionario);  // Verificar los datos recibidos
            setNewFuncionario({
                nombre_funcionario: funcionario.nombre_funcionario,
                puesto: funcionario.puesto,
                institucion: funcionario.institucion,
                telefono: funcionario.telefono,
                correo: funcionario.correo,
                imagen: funcionario.imagen
            }); 
            setFileName(funcionario.imagen); 
        });
    }, [funcionariID]);

    const handleChange = (e) => {
        setNewFuncionario({
            ...newFuncionario,
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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newFuncionario.correo)) {
                throw new Error('Correo electrónico inválido');
            }
    
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(newFuncionario.telefono)) {
                throw new Error('Número de teléfono inválido');
            }

            const formData = new FormData();
            formData.append('nombre_funcionario', newFuncionario.nombre_funcionario);
            formData.append('puesto', newFuncionario.puesto);
            formData.append('institucion', newFuncionario.institucion);
            formData.append('telefono', newFuncionario.telefono);
            formData.append('correo', newFuncionario.correo);
            if (selectedFile) {
                formData.append('imagen', selectedFile);
            } else {
                formData.append('imagen', newFuncionario.imagen); 
            }

            const response = await fetch(`${host}funcionario/editar/${funcionariID}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert('Funcionario actualizado exitosamente');
                window.location.href = '/pagina/contactos/funcionarios';
            } else {
                throw new Error('Error al actualizar el funcionario');
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Actualizar Contacto de Funcionario</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type='text'
                            id="nombre_funcionario"
                            name="nombre_funcionario"
                            placeholder="Nombre Completo"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newFuncionario.nombre_funcionario}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="puesto"
                            name="puesto"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newFuncionario.puesto}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Seleccione un área</option>
                            <option value="Presidente/a Municipal">Presidente/a Municipal</option>
                            <option value="Secretario/a Municipal">Secretario/a Municipal</option>
                            <option value="Tesorero/a Municipal">Tesorero/a Municipal</option>
                            <option value="Contralor/a Municipal">Contralor/a Municipal</option>
                            <option value="Director/a de Servicios Municipales">Director/a de Servicios Municipales</option>
                            <option value="Conciliador/a Municipal">Conciliador/a Municipal</option>
                            <option value="Director/a de Reglamentos">Director/a de Reglamentos</option>
                            <option value="Director/a de Obras Públicas">Director/a de Obras Públicas</option>
                            <option value="Bomberos y Protección Civil">Bomberos y Protección Civil</option>
                            <option value="Seguridad Pública y Transito Municipal">Seguridad Pública y Transito Municipal</option>
                            <option value="Director/a de Catastro">Director/a de Catastro</option>
                            <option value="Director/a General de CAASST">Director/a General de CAASST</option>
                            <option value="Presidente/a del Sistema DIF">Presidente/a del Sistema DIF</option>
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="institucion"
                            name="institucion"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newFuncionario.institucion}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Seleccione una institución</option>
                            <option value="Presidencia Municipal">Presidencia Municipal</option>
                            <option value="Agua Potable CAASST">Agua Potable CAASST</option>
                            <option value="Sistema DIF">Sistema DIF</option>
                            <option value="Seguridad Publica">Seguridad Publica</option>
                            <option value="Bomberos y Protección Civil">Bomberos y Protección Civil</option>
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            id="telefono"
                            name="telefono"
                            type='tel'
                            placeholder="Telefono"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newFuncionario.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            id="correo"
                            name="correo"
                            type='email'
                            placeholder="Correo"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newFuncionario.correo}
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
                    <Link to="/pagina/contactos/funcionarios" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default FuncionarioUpdate;
