import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';
import {host} from '../../conexion';

function DocumentosInsert() {
    const [newDocumento, setNewDocumento] = useState({
        id_fraccion: '',
        trimestre: '',
        año: '',
        file: null
    });
    const [fraccion, setFraccion] = useState([]);
    const [año, setAño] = useState([]);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fraccionID = localStorage.getItem('fraccionID');
        if (fraccionID) {
            setNewDocumento((prevDocumento) => ({
                ...prevDocumento,
                id_fraccion: fraccionID
            }));
        }
    }, []);

    useEffect(() => {
        const fetchFraccion = async () => {
            try {
                const response = await fetch(`${host}fraccion`);
                const data = await response.json();
                setFraccion(data);
            } catch (error) {
                console.error('Error al obtener los artículos:', error);
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
            file: file
        });
        setFileName(file.name);
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id_fraccion', newDocumento.id_fraccion);
        formData.append('año', newDocumento.año);
        formData.append('trimestre', newDocumento.trimestre);
        formData.append('file', newDocumento.file);

        try {
            const response = await fetch(`${host}documento/crear`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewDocumento({
                id_fraccion: '',
                trimestre: '',
                año: '',
                file: null
            });
            setFileName("");
             // Obtener id_fraccion del localStorage
            const fraccionID = localStorage.getItem('fraccionID');
             // Redirigir a la nueva página con el id_fraccion
            window.location.href = `/funcionarios/archivos?fraccion=${fraccionID}`;

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa un nuevo Artículo</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="fraccion"
                            name="id_fraccion"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newDocumento.id_fraccion}
                            onChange={handleInputChange}
                            required
                            disabled
                        >
                            <option value="">Selecciona un artículo</option>
                            {fraccion.map((item, index) => (
                                <option key={index} value={item.id_fraccion}>
                                    {item.fraccion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <select
                            id="trimestre"
                            name="trimestre"
                            className="fs-2 border-bottom-only no-rounded"
                            value={newDocumento.trimestre}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona un trimestre</option>
                            <option value="1"> 1 </option>
                            <option value="2"> 2 </option>
                            <option value="3"> 3 </option>
                            <option value="4"> 4 </option>
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
                    <Link to={`/funcionarios/archivos?fraccion=${newDocumento.id_fraccion}`} className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default DocumentosInsert;
