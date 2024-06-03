import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Actualización de useHistory a useNavigate
import '../css/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Actualización de useHistory a useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: username, contrasena: password }),
      });
      if (response.ok) {
        // Manejar inicio de sesión exitoso
        navigate('/menu'); // Redirigir a la página de menú
      } else {
        const data = await response.json();
        setError(data.detail);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Santiago Tulatepec</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" style={{color: "#04703F", fontSize: "1.5rem"}}>Usuario</label>
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
        <label htmlFor="password" style={{color: "#04703F", fontSize: "1.5rem"}}>Contraseña</label>
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
