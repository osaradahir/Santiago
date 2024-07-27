import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginForm';
import Menu from './pages/Menu';
import Usuarios from './pages/user/Usuarios';
import UserInsert from './pages/user/UserInsert';
import UserUpdate from './pages/user/UserUpdate';
import Pagina from './pages/page/Pagina';
import PaginaInsert from './pages/page/PaginaInsert';
import Carrusel from './pages/page/Carrusel';
import CarruselInsert from './pages/page/CarruselInsert';
import CarrucelUpdate from './pages/page/CarruselUpdate';
import Mapa from './pages/page/Mapa';
import MapaInsert from './pages/page/MapaInsert';
import MapaUpdate from './pages/page/MapaUpdate';
import Noticias from './pages/news/Noticias';
import NoticiaInsert from './pages/news/NoticiaInsert';
import NoticiaUpdate from './pages/news/NoticiaUpdate';
import Eventos from './pages/events/Eventos';
import EventoInsert from './pages/events/EventoInsert';
import EventoUpdate from './pages/events/EventoUpdate';
import Encuestas from './pages/surveys/Encuestas';
import EncuestaInsert from './pages/surveys/EncuestaInsert';
import Transparencia from './pages/transparency/Transparencia';
import TransparenciaInsert from './pages/transparency/TransparenciaInsert';
import TransparenciaUpdate from './pages/transparency/TransparenciaUpdate';
import Fraccion from './pages/transparency/Fraccion';
import FraccionInsert from './pages/transparency/FraccionInsert';
import FraccionUpdate from './pages/transparency/FraccionUpdate';
import Documentos from './pages/transparency/Documentos';
import DocumentosInsert from './pages/transparency/DocumentosInsert';

// Componente PrivateRoute para proteger rutas
const PrivateRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return token && allowedRoles.includes(role) ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<PrivateRoute element={<Menu />} allowedRoles={['administrador']} />} />
          <Route path="/usuarios" element={<PrivateRoute element={<Usuarios />} allowedRoles={['administrador']} />} />
          <Route path="/usuarios/insertar" element={<PrivateRoute element={<UserInsert />} allowedRoles={['administrador']} />} />
          <Route path="/usuarios/actualizar" element={<PrivateRoute element={<UserUpdate />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/logo" element={<PrivateRoute element={<Pagina />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/logo/insertar" element={<PrivateRoute element={<PaginaInsert />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/carrusel" element={<PrivateRoute element={<Carrusel />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/carrusel/insertar" element={<PrivateRoute element={<CarruselInsert />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/carrusel/actualizar" element={<PrivateRoute element={<CarrucelUpdate />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/mapa" element={<PrivateRoute element={<Mapa />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/mapa/insertar" element={<PrivateRoute element={<MapaInsert />} allowedRoles={['administrador']} />} />
          <Route path="/pagina/mapa/actualizar" element={<PrivateRoute element={<MapaUpdate />} allowedRoles={['administrador']} />} />
          <Route path="/noticias" element={<PrivateRoute element={<Noticias />} allowedRoles={['administrador']} />} />
          <Route path="/noticias/insertar" element={<PrivateRoute element={<NoticiaInsert />} allowedRoles={['administrador']} />} />
          <Route path="/noticias/actualizar" element={<PrivateRoute element={<NoticiaUpdate />} allowedRoles={['administrador']} />} />
          <Route path="/eventos" element={<PrivateRoute element={<Eventos />} allowedRoles={['administrador']} />} />
          <Route path="/eventos/insertar" element={<PrivateRoute element={<EventoInsert />} allowedRoles={['administrador']} />} />
          <Route path="/eventos/actualizar" element={<PrivateRoute element={<EventoUpdate />} allowedRoles={['administrador']} />} />
          <Route path="/encuestas" element={<PrivateRoute element={<Encuestas />} allowedRoles={['administrador']} />} />
          <Route path="/encuesta/insertar" element={<PrivateRoute element={<EncuestaInsert />} allowedRoles={['administrador']} />} />
          <Route path="/transparencia/articulo" element={<PrivateRoute element={<Transparencia />} allowedRoles={['director transparencia', 'administrador']} />} />
          <Route path="/transparencia/articulo/insertar" element={<PrivateRoute element={<TransparenciaInsert />} allowedRoles={['director transparencia', 'administrador']} />} />
          <Route path="/transparencia/articulo/actualizar" element={<PrivateRoute element={<TransparenciaUpdate />} allowedRoles={['director transparencia', 'administrador']} />} />
          <Route path="/transparencia/fraccion" element={<PrivateRoute element={<Fraccion />} allowedRoles={['director transparencia', 'administrador']} />} />
          <Route path="/transparencia/fraccion/insertar" element={<PrivateRoute element={<FraccionInsert />} allowedRoles={['director transparencia', 'administrador']} />} />
          <Route path="/transparencia/fraccion/actualizar" element={<PrivateRoute element={<FraccionUpdate />} allowedRoles={['director transparencia', 'administrador']} />} />
          <Route path="/transparencia/archivo" element={<PrivateRoute element={<Documentos />} allowedRoles={['director transparencia', 'administrador']} />} />
          <Route path="/transparencia/archivo/insertar" element={<PrivateRoute element={<DocumentosInsert />} allowedRoles={['director transparencia', 'administrador']} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
