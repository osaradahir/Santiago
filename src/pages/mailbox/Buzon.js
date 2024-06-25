import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar';
import * as XLSX from 'xlsx';
import {host} from '../../conexion';

function Buzon() {
    const [datosBuzon, setDatosBuzon] = useState([]);
    const [selectedBuzon, setSelectedBuzon] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}buzon`);
                const data = await response.json();               
                setDatosBuzon(data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleRowClick = (buzon) => {
        setSelectedBuzon(buzon);
        setShowModal(true);
    };
    
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const filteredData = searchTerm 
    ? datosBuzon.filter(buzon => 
        buzon.nombre?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        buzon.telefono?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        buzon.correo?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) 
    : datosBuzon;

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBuzon(null);
    };

    const handleExportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(datosBuzon);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Buzon");
        XLSX.writeFile(workbook, "Buzon.xlsx");
    };

    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Buzon Ciudadano</b></h1>
                    <div className="d-flex align-items-center">
                        <div className="input-group rounded-pill border border-1 me-2 custom-border">
                            <input
                                type="search"
                                className="form-control rounded-pill border border-2 text-center custom-border"
                                placeholder="Buscar..."
                                aria-label="Buscar"
                                aria-describedby="search-addon"
                                style={{ color: "#04703F"}}
                                onChange={handleSearch}
                            />
                        </div>
                        <button className="btn btn-link" onClick={handleExportToExcel} style={{ color: "#04703F" }}>
                            <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#04703F" style={{ width: "54px", height: "54px" }}>
                                <path d="M13,5.82842712 L13,17 L11,17 L11,5.82842712 L7.75735931,9.07106781 L6.34314575,7.65685425 L12,2 L17.6568542,7.65685425 L16.2426407,9.07106781 L13,5.82842712 Z M4,16 L6,16 L6,20 L18,20 L18,16 L20,16 C20,17.3333333 20,18.6666667 20,20 C20,21.1000004 19.1000004,22 18,22 C18,22 6,22 6,22 C4.9000001,22 4,21.037204 4,20 C4,20 4,18.6666667 4,16 Z" id="Shape">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Correo</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Teléfono</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((buzon) => (
                        <tr
                            key={buzon.id_buzon}
                            onClick={() => handleRowClick(buzon)}
                            style={{ cursor: "pointer" }}
                        >
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{buzon.nombre}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{buzon.correo}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{buzon.telefono}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del comentario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBuzon && (
                        <>
                            <p><strong>Nombre:</strong> {selectedBuzon.nombre}</p>
                            <p><strong>Fecha:</strong> {selectedBuzon.dia}</p>
                            <p><strong>Teléfono:</strong> {selectedBuzon.telefono}</p>
                            <p><strong>Correo:</strong> {selectedBuzon.correo}</p>
                            <p><strong>Comentario:</strong> {selectedBuzon.comentarios}</p>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Buzon;
