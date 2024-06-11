import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CustomNavbar from '../../components/CustomNavbar_03';

function TransparenciaInsert(){
    const [newTransparencia, setNewTransparencia] = useState({
        num_articulo: '',
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewTransparencia({
            ...newTransparencia,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/articulo/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTransparencia)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            setNewTransparencia({
                num_articulo: ''
            });
            window.location.href = '/transparencia/articulo';

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }

    }

    return(
        <div className="app">
            <CustomNavbar />
            <div className="d-flex align-items-center justify-content-center text-center">
                <h1 className="fs-1">Ingresa un nuevo Articulo</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
                <div id="form-container-input" className="d-flex flex-column align-items-center">
                    <div className="form-group d-flex py-2 w-100 justify-content-center">
                        <input
                            type="number"
                            id="num_articulo"
                            name="num_articulo"
                            className="fs-2 border-bottom-only no-rounded"
                            placeholder="Numero del articulo"
                            value={newTransparencia.num_articulo}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                </div>
                <div id="form-container-button" className="d-flex align-items-center justify-content-around px-5">
                    <Link to="/transparencia/articulo" className="btn btn-outline-dark fs-4 btn-lg rounded-pill boton">Cancelar</Link>
                    <button type="submit" className="btn btn-outline-dark fs-4 btn-lg rounded-pill">Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default TransparenciaInsert;