import React from 'react';
import '../css/Menu.css';

/**
The Menu function returns a JSX element representing a menu with various links categorized into left
and right sections.
@returns The Menu component is being returned. It is a React functional component that renders a
menu with links to different sections such as Usuarios, Pagina, Noticias, Eventos, Encuestas, and
Transparencia.
 */
function Menu() {
    return (
        <div className="container">
            <h1 className="title">Menu</h1>
            <div className="menu">
                <div className="left">
                    <a href="/usuarios" className="button">Usuarios</a>
                    <a href="/pagina/logo" className="button">Pagina</a>
                </div>
                <div className="right">
                    <a href="/noticias" className="button">Noticias</a>
                    <a href="/eventos" className="button">Eventos</a>
                </div>
                <div className="right">
                    <a href="/encuestas" className="button">Encuestas</a>
                    <a href="/transparencia/articulo" className="button">Transparencia</a>
                </div>
                <div className="right">
                    <a href="/buzon" className="button">Buzon</a>
                    <a href="/conac/tomo" className="button">CONAC</a>
                </div>
                
            </div>
        </div>
    );
}

export default Menu;
