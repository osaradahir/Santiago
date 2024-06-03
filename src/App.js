import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/insertar" element={<UserInsert />} />
          <Route path="/usuarios/actualizar" element={<UserUpdate />} />
          <Route path="/pagina/logo" element={<Pagina />} />
          <Route path="/pagina/logo/insertar" element={<PaginaInsert />} />
          <Route path="/pagina/carrusel" element={<Carrusel />} />
          <Route path="/pagina/carrusel/insertar" element={<CarruselInsert />} />
          <Route path="/pagina/carrusel/actualizar" element={<CarrucelUpdate />} />
          <Route path="/pagina/mapa" element={<Mapa />} />
          <Route path="/pagina/mapa/insertar" element={<MapaInsert />} />
          <Route path="/pagina/mapa/actualizar" element={<MapaUpdate />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/insertar" element={<NoticiaInsert />} />
          <Route path="/noticias/actualizar" element={<NoticiaUpdate />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/insertar" element={<EventoInsert />} />
          <Route path="/eventos/actualizar" element={<EventoUpdate />} />
          <Route path="/encuestas" element={<Encuestas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
