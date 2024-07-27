{/* We use this class to implement login functions in the server and authenticate the user
we also use this to represent to the user this transaction on the front end. */ }

//React and style imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

//Primary function with HTML methods for login
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      //In this try we send a POST to the server indicating it's a json object with the username and password por the auth
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: username, contrasena: password }),
      });
      //If the response succeds we set the local tokens
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.rol);
        //Here we asign thee role to the user
        if (data.rol === 'administrador') {
          navigate('/menu');
        } else if (data.rol === 'director transparencia') {
          navigate('/transparencia/articulo');
        } else {
          navigate('/articulos'); // Ruta por defecto o para otros roles
          
        }
      //If we recive and error or the con fails we manage the error state  
      } else {
        const data = await response.json();
        setError(data.detail);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
    }
  };

  //We return the HTML block necesary for the function to proceed with the parameters returned from the HTTP call
  return (
    <div className="container">
      <h1 className="title">Santiago Tulatepec</h1>
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
