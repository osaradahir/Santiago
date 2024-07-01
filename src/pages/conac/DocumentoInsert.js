import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';
import { host } from '../../conexion';

function DocumentosInsertConac() {
    const [newDocumento, setNewDocumento] = useState({
        nombre_tomo: '',
        nombre_seccion: '',
        nombre_fraccion: '',
        trimestre_categoria: '',
        año: '',
        archivo: null
    });
    const [tomo, setTomo] = useState([]);
    const [seccion, setSeccion] = useState([]);
    const [fraccion, setFraccion] = useState([]);
    const [año, setAño] = useState([]);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchTomo = async () => {
            try {
                const response = await fetch(`${host}tomo`);
                const data = await response.json();
                setTomo(data);
            } catch (error) {
                console.error('Error al obtener los tomos:', error);
            }
        };

        fetchTomo();
    }, []);

    useEffect(() => {
        const fetchSeccion = async () => {
            try {
                const response = await fetch(`${host}seccion`);
                const data = await response.json();
                setSeccion(data);
            } catch (error) {
                console.error('Error al obtener las secciones:', error);
            }
        };

        fetchSeccion();
    }, []);

    useEffect(() => {
        const fetchFraccion = async () => {
            try {
                const response = await fetch(`${host}fraccion-conac`);
                const data = await response.json();
                setFraccion(data);
            } catch (error) {
                console.error('Error al obtener las fracciones CONAC:', error);
            }
        };

        fetchFraccion();
    }, []);

    useEffect(() => {
        const fetchAño = async () => {
            try {
                const response = await fetch(`${host}year`);
                const data = await response.json();
                setAño(data);
            } catch (error) {
                console.error('Error al obtener los años:', error);
            }
        };

        fetchAño();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocumento({
            ...newDocumento,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setNewDocumento({
            ...newDocumento,
            archivo: file
        });
        setFileName(file.name);
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre_tomo', newDocumento.nombre_tomo);
        formData.append('nombre_seccion', newDocumento.nombre_seccion);
        formData.append('nombre_fraccion', newDocumento.nombre_fraccion);
        formData.append('trimestre_categoria', newDocumento.trimestre_categoria);
        formData.append('año', newDocumento.año);
        formData.append('file', newDocumento.archivo, newDocumento.archivo.name);

        try {
            console.log('Datos enviados:', newDocumento); // Verifica los datos antes de enviar

            const response = await fetch(`${host}documento-conac/crear`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error en la solicitud: ${errorData.detail}`);
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);

            // Limpiar formulario después de éxito
            setNewDocumento({
                nombre_tomo: '',
                nombre_seccion: '',
                nombre_fraccion: '',
                trimestre_categoria: '',
                año: '',
                archivo: null
            });
            setFileName("");
            alert('El documento se ha guardado correctamente!');

            // Redirigir o actualizar la interfaz según sea necesario
            window.location.href = '/conac/archivo';

        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al enviar los datos. Por favor, revisa los campos y vuelve a intentarlo.');
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa un nuevo Documento</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="tomo"
                            name="nombre_tomo"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newDocumento.nombre_tomo}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un tomo</option>
                            {tomo.map((item, index) => (
                                <option key={index} value={item.nombre_tomo}>
                                    {item.nombre_tomo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="seccion"
                            name="nombre_seccion"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newDocumento.nombre_seccion}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona una sección</option>
                            {seccion.map((item, index) => (
                                <option key={index} value={item.nombre_seccion}>
                                    {item.nombre_seccion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="fraccion"
                            name="nombre_fraccion"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newDocumento.nombre_fraccion}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona una fracción</option>
                            {fraccion.map((item, index) => (
                                <option key={index} value={item.nombre_fraccion}>
                                    {item.nombre_fraccion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="trimestre_categoria"
                            name="trimestre_categoria"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newDocumento.trimestre_categoria}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un trimestre o Categoria</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="Cuenta Pública">Cuenta Pública</option>
                            <option value="Reglamento">Reglamento</option>
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="año"
                            name="año"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newDocumento.año}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un año</option>
                            {año.map((item, index) => (
                                <option key={index} value={item.año}>
                                    {item.año}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <button type="button" className="fs-2 border-bottom-only no-rounded" onClick={handleFileInputClick} style={{width:"100%"}}>
                            Seleccionar archivo
                        </button>
                        <span className="fs-2 border-bottom-only no-rounded">
                            {fileName.length > 15 ? `${fileName.substring(0, 15)}...` : fileName}
                        </span>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            className="fs-2 border-bottom-only no-rounded"
                            onChange={handleFileChange}
                            accept=".pdf, .xls, .xlsx, .doc, .docx" 
                            required
                        />
                    </div>
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/transparencia/archivo" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default DocumentosInsertConac;
