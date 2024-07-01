import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_01';
import { UpdateIcon } from '../../components/Icons';

import {host} from '../../conexion';

function Institucion() {
    /* The above code is written in JavaScript and it is using React's useState hook to manage state in
    a functional component. Here is a breakdown of what each useState hook is doing: */

    const [datosInstitucion, setDatosInstitucion] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [containerWidth] = useState(window.innerWidth);
    const [containerHeight] = useState(window.innerHeight);

   /*  The above code is a React useEffect hook that fetches data from a specific endpoint
   (`institucion`), processes the data by adjusting the format of 'estado' and 'permisos',
   and then sets the processed data in the state variable `datosInstitucion`. If there is an error
   during the data fetching or processing, it will be logged to the console. This useEffect hook
   runs only once when the component mounts due to the empty dependency array `[]`. */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}contacto`);
                const data = await response.json();
                const datos = data
                setDatosInstitucion(datos);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    
    /**
     * The function `handleRowClick` checks if a row is already selected and selects it if not, logging
     * the selected employee ID.
     * @param id_contacto - The `id_contacto` parameter in the `handleRowClick` function
     * represents the unique identifier of a particular employee or staff member. When a row
     * corresponding to a specific employee is clicked, this function is called to handle the click
     * event. The function checks if the clicked row is already selected or not
     * @returns If the `selectedId` is equal to `id_contacto`, the function will return nothing
     * (`undefined`) because it contains a `return` statement with no value specified.
     */
    const handleRowClick = (id_contacto) => {
        if (selectedId === id_contacto) {
            return; 
        } else {
            setSelectedId(id_contacto);
            console.log("ID de la institucion seleccionada:", id_contacto);
        }
    };

    /**
     * The function calculates the optimal size based on a container's width and height, adjusting it
     * to a smaller size and maintaining proportions.
     * @param containerWidth - ContainerWidth is the width of the container where you want to display
     * an element or image. It is used in the `calcularTamañoOptimo` function to calculate the maximum
     * width based on a percentage of the container's width.
     * @param containerHeight - containerHeight is the height of the container where you want to
     * display an element or image. It is used in the function calcularTamañoOptimo to calculate the
     * optimal size for the element based on the container's dimensions.
     * @returns The function `calcularTamañoOptimo` is returning an object with the properties `width`
     * and `height`. The `width` is calculated as 25% of 60% of the `containerWidth`, and the `height`
     * is calculated as 25% of 60% of the `containerHeight`.
     */
    function calcularTamañoOptimo(containerWidth, containerHeight) {
        const maxWidth = containerWidth * 0.6;
        const maxHeight = containerHeight * 0.6;
        return { width: maxWidth * 0.25, height: maxHeight * 0.25 };
    }
    
    const tamañoOptimo = calcularTamañoOptimo(containerWidth, containerHeight);

    
    /**
     * The handleSearch function updates the search term based on user input.
     * @param event - The `event` parameter in the `handleSearch` function is an object that contains
     * information about the event that occurred, such as the target element that triggered the event.
     * In this case, it is used to get the value of the input field that triggered the search.
     */
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    
    /* The `filteredData` constant is filtering the `datosInstitucion` array based on the `searchTerm`
    value. */
    const filteredData = searchTerm 
    ? datosInstitucion.filter(institucion => 
        institucion.nombre_institucion?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        institucion.direccion?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        institucion.telefono?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        institucion.email?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
        institucion.correo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        institucion.facebook?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        institucion.x?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        institucion.youtube?.toString().toLowerCase().includes(searchTerm.toLowerCase()) 
    ) 
    : datosInstitucion;

    {/* The above code is a JSX component written in JavaScript for a web application. It appears to be
    a contact management page for functionaries. Here is a breakdown of what the code is doing: */}
    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
              
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Contactos Institucion</b></h1>
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
                        <Link to={selectedId ? `/pagina/contactos/institucinal/actualizar?id_contacto=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>

                    </div>
                </div>
            </div>
            
            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre Institucion</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Direccion</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Telefono</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Correo</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Horario</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Foto</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((institucion) => (
                        <tr
                            key={institucion.id_contacto}
                            onClick={() => handleRowClick(institucion.id_contacto)}
                            className={selectedId === institucion.id_contacto ? 'selected' : ''}
                            style={{  cursor: "pointer" }}
                        >
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{institucion.nombre_institucion}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{institucion.direccion.length > 15 ? `${institucion.direccion.substring(0, 15)}...` : institucion.direccion}</td>                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{institucion.telefono}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{institucion.email.length > 13 ? `${institucion.email.substring(0, 13)}...` : institucion.email}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{institucion.horario}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                <img src={`${host}${institucion.ruta}${institucion.imagen}`} alt="" style={{ width: tamañoOptimo?.width, height: tamañoOptimo?.height, margin: 'auto', display: 'block'}} />
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Institucion;
