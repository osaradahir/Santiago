import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 
import '../../css/user/Usuarios.css';
import CustomNavbar from '../../components/CustomNavbar_01';
import { CreateIcon, UpdateIcon, DeleteIcon } from '../../components/Icons';
import {host} from '../../conexion';

function Funcionarios() {
    /* The above code is written in JavaScript and it is using React's useState hook to manage state in
    a functional component. Here is a breakdown of what each useState hook is doing: */

    const [datosFuncionarios, setDatosFuncionarios] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [containerWidth] = useState(window.innerWidth);
    const [containerHeight] = useState(window.innerHeight);

   /*  The above code is a React useEffect hook that fetches data from a specific endpoint
   (`funcionario`), processes the data by adjusting the format of 'estado' and 'permisos',
   and then sets the processed data in the state variable `datosFuncionarios`. If there is an error
   during the data fetching or processing, it will be logged to the console. This useEffect hook
   runs only once when the component mounts due to the empty dependency array `[]`. */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${host}funcionario`);
                const data = await response.json();
                const datos = data
                setDatosFuncionarios(datos);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);
    
    
    /**
     * The function `handleRowClick` checks if a row is already selected and selects it if not, logging
     * the selected employee ID.
     * @param id_funcionario - The `id_funcionario` parameter in the `handleRowClick` function
     * represents the unique identifier of a particular employee or staff member. When a row
     * corresponding to a specific employee is clicked, this function is called to handle the click
     * event. The function checks if the clicked row is already selected or not
     * @returns If the `selectedId` is equal to `id_funcionario`, the function will return nothing
     * (`undefined`) because it contains a `return` statement with no value specified.
     */
    const handleRowClick = (id_funcionario) => {
        if (selectedId === id_funcionario) {
            return; 
        } else {
            setSelectedId(id_funcionario);
            console.log("ID del funcionario seleccionado:", id_funcionario);
        }
    };
    
    /**
     * The `handleDelete` function confirms and deletes a selected employee record, updates the list of
     * employees, and clears the selection.
     */
    const handleDelete = () => {
        if (selectedId) {
            const confirmDelete = window.confirm('¿Seguro que deseas eliminar este funcionario?');
            if (confirmDelete) {
                fetch(`${host}funcionario/borrar/${selectedId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el funcionario');
                    }
                    return response.json();
                })
                .then(data => {
                    const updatedFuncionarios = datosFuncionarios.filter(funcionario => funcionario.id_funcionario !== selectedId);
                    setDatosFuncionarios(updatedFuncionarios);
                    setSelectedId(null);
                    alert('Contacto elemininado Correctamente.');
                })
                .catch(error => {
                    console.error('Error al eliminar el funcionario:', error);
                });
            }
        } else {
            alert('Por favor, selecciona un funcionario para eliminar.');
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
    
    /* The `filteredData` constant is filtering the `datosFuncionarios` array based on the `searchTerm`
    value. */
    const filteredData = searchTerm 
    ? datosFuncionarios.filter(funcionario => 
        funcionario.nombre_funcionario?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.puesto?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.institucion?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        funcionario.telefono?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
        funcionario.correo?.toString().toLowerCase().includes(searchTerm.toLowerCase())

    ) 
    : datosFuncionarios;

    {/* The above code is a JSX component written in JavaScript for a web application. It appears to be
    a contact management page for functionaries. Here is a breakdown of what the code is doing: */}
    return (
        <div className="app">
            <CustomNavbar />
            <div className="acontainer">
              
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-1"><b>Contactos Funcionarios</b></h1>
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
                        <Link to="/pagina/contactos/funcionarios/insertar" className="link-dark text-decoration-none px-2">
                            <CreateIcon />
                        </Link>
                        <Link to={selectedId ? `/pagina/contactos/funcionarios/actualizar?id_funcionario=${selectedId}` : '#'} className="link-dark text-decoration-none px-2">
                            <UpdateIcon />
                        </Link>
                        <button type="button" className="text-decoration-none px-2" style={{backgroundColor: "white", border:"none"}} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>

                    </div>
                </div>
            </div>
            
            <div id="tabla-container" className="px-4 py-4" style={{ marginTop: "200px" }}>
                <table className="table table-hover" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #04703F" }}>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Nombre Funcionario</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Puesto</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Institucion</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Telefono</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Correo</th>
                            <th scope="col" className="fs-3" style={{ backgroundColor: "#FDFBF6", borderBottom: "none", color: "#04703F" }}>Foto</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((funcionario) => (
                        <tr
                            key={funcionario.id_funcionario}
                            onClick={() => handleRowClick(funcionario.id_funcionario)}
                            className={selectedId === funcionario.id_funcionario ? 'selected' : ''}
                            style={{  cursor: "pointer" }}
                        >
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{funcionario.nombre_funcionario}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{funcionario.puesto}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{funcionario.institucion}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{funcionario.telefono}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>{funcionario.correo}</td>
                            <td className='fs-4' style={{ borderBottom: "2px solid #04703F", color: "#04703F"}}>
                                <img src={`${host}${funcionario.ruta}${funcionario.imagen}`} alt="" style={{ width: tamañoOptimo?.width, height: tamañoOptimo?.height, margin: 'auto', display: 'block'}} />
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Funcionarios;
