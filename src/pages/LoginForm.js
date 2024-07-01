import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import {host} from '../conexion';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    
  /**
  The function `handleSubmit` is an asynchronous function that handles form submission by sending a
  POST request to a login endpoint, processing the response data, and redirecting the user based on
  their role.
  @param event - The `event` parameter in the `handleSubmit` function is an event object that
  represents the event being handled, which in this case is typically a form submission event. By
  calling `event.preventDefault()`, you are preventing the default behavior of the form submission,
  allowing you to handle the form data submission asynchronously
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

      try {
          const response = await fetch(`${host}login`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nombre: username, contrasena: password }),
          });

          if (response.ok) {
              const data = await response.json();
              localStorage.setItem('token', data.token);
              localStorage.setItem('role', data.rol);
              localStorage.setItem('area', data.area);

              switch (data.rol) {
                  case 'administrador':
                      navigate('/menu');
                      break;
                  case 'director transparencia':
                      navigate('/transparencia/articulo');
                      break;
                  default:
                      navigate('/funcionarios/articulo');
                      break;
              }
          } else {
              const data = await response.json();
              setError(data.detail || 'Error desconocido');
          }
      } catch (error) {
          console.error('Error al iniciar sesión:', error);
          setError('Error al iniciar sesión. Por favor, intente nuevamente.');
      }
  };

/* The code snippet you provided is a React functional component named `Login`. Within this component,
the `return` statement is responsible for rendering the JSX (JavaScript XML) elements that make up
the login form interface. Here's a breakdown of what each part of the `return` statement is doing: */

  return (
    <div className="container">
      <h1 className="title">Santiago Tulan
      tepec</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" style={{ color: "#04703F", fontSize: "1.5rem" }}>Usuario</label>
        <div className="inputIcon">
          <img src="https://cdn-icons-png.freepik.com/512/1077/1077063.png" alt="Usuario" className="icon" />
          <div className="line"></div>
          <input
            type="text"
            className="input"
            name="username"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <label htmlFor="password" style={{ color: "#04703F", fontSize: "1.5rem" }}>Contraseña</label>
        <div className="inputIcon">
          <img src="https://cdn-icons-png.flaticon.com/512/747/747305.png" alt="Contraseña" className="icon" />
          <div className="line"></div>
          <input
            type="password"
            className="input"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="button_a">
          Iniciar Sesión
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
