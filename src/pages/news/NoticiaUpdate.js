import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import {host} from '../../conexion';

function NoticiaUpdate() {
    /* The code snippet you provided is a React functional component called `NoticiaUpdate`. Let's
    break down the purpose of each part of the code: */
    const [newNoticia, setNewNoticia] = useState({
        titulo: '',
        contenido: '',
        imagen: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const noticiaID = searchParams.get('id_noticia');

    /* The `useEffect` hook in the provided code snippet is responsible for fetching and updating the
    data of a specific news article based on the `noticiaID` when the component mounts or when
    `noticiaID` changes. Here's a breakdown of what it does: */
    useEffect(() => {
        if (noticiaID) {
            fetch(`${host}noticia/${noticiaID}`)
                .then(response => response.json())
                .then(data => {
                    const noticiaData = data[0];
                    setNewNoticia({
                        titulo: noticiaData.titulo,
                        contenido: noticiaData.contenido,
                        imagen: noticiaData.imagen
                    });
                    setFileName(noticiaData.imagen);
                })
                .catch(error => console.error('Error al obtener los datos de la noticia:', error));
        }
    }, [noticiaID]);

   /**
    * The above functions handle clicking on a file input element and changing the selected file.
    */
    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(file.name);
    };

    /**
     * The handleChange function updates the state of a noticia object with a new value based on the
     * name of the input field being changed.
     * @param event - The `event` parameter in the `handleChange` function is an object that represents
     * the event that occurred, such as a change in an input field. It contains information about the
     * event, including the target element that triggered the event (in this case, an input field), and
     * any data associated with that
     */
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewNoticia(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * The function `handleSubmit` is an asynchronous function that handles form submission by sending
     * a PUT request to edit a news article with the provided data and file, displaying success or
     * error messages accordingly.
     * @param event - The `event` parameter in the `handleSubmit` function is an event object that
     * represents the event being handled, in this case, a form submission event. By calling
     * `event.preventDefault()`, you are preventing the default behavior of the form submission, which
     * allows you to handle the form data submission asynchronously using
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('titulo', newNoticia.titulo);
        formData.append('contenido', newNoticia.contenido);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        
        try {
            const response = await fetch(`${host}noticia/editar/${noticiaID}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Noticia editada exitosamente: ${data.titulo}`);
                window.location.href = '/noticias';
            } else {
                const errorData = await response.json();
                alert(`Error al editar la noticia: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error al editar la noticia:', error);
            alert('Error al editar la noticia.');
        }
    };

    /* The `return` statement in the `NoticiaUpdate` component is responsible for rendering the JSX
    (JavaScript XML) elements that make up the user interface of the component. Let's break down
    what each part of the returned JSX code is doing: */
    return (
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Editar Noticia</h1>
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
                        <span className="fs-2 border-bottom-only no-rounded">
                            {fileName ? (fileName.length > 15 ? `${fileName.substring(0, 15)}...` : fileName) : ''}
                        </span>
                        <input
                            type="file"
                            id="imagen"
                            name="imagen"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            className="fs-2 border-bottom-only no-rounded"
                            onChange={handleFileChange}
                            accept=".png, .jpg, .jpeg"
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

export default NoticiaUpdate;
