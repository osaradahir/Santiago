import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar';
import { host } from '../../conexion';

function ColorUpdate() {
    const [newColor, setNewColor] = useState({
        nombre_color: '',
        valor_hex: ''
    });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const colorID = searchParams.get('id_color');

    useEffect(() => {
        if (colorID) {
            fetch(`${host}color/${colorID}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const colorData = data[0]; // Asumiendo que siempre hay un solo objeto en el arreglo
                        setNewColor({
                            nombre_color: colorData.nombre_color,
                            valor_hex: colorData.valor_hex
                        });
                    } else {
                        console.error('No se encontraron datos de color');
                    }
                })
                .catch(error => console.error('Error al obtener los datos del color:', error));
        }
    }, [colorID]);

    const handleChange = (event) => {
        setNewColor({
            ...newColor,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(`${host}color/editar/${colorID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newColor)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Color actualizado:', data);
                alert('Color actualizado correctamente');
                window.location.href = '/pagina/color';
            })
            .catch(error => console.error('Error al actualizar el color:', error));
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div style={{ marginTop: "100px" }}>
                <div className="d-flex align-items-center justify-content-center text-center">
                    <h1 className="fs-1">Edita el Color</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                    <div id="form-container-input" className="d-flex flex-column align-items-center">
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="nombre_color"
                                name="nombre_color"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Nombre del color"
                                value={newColor.nombre_color}
                                onChange={handleChange}
                                readOnly
                                required
                            />
                        </div>
                        <div className="form-group d-flex py-2 w-100 justify-content-center">
                            <input
                                type="text"
                                id="valor_hex"
                                name="valor_hex"
                                className="fs-2 border-bottom-only no-rounded"
                                placeholder="Valor HEX"
                                value={newColor.valor_hex}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                        <Link to="/pagina/color" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                        <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                    </div>
                </form>
            </div>
            
        </div>
    );
}

export default ColorUpdate;
