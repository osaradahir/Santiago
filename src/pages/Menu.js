{/* This module uses a simple HTML section to represent navigaton buttons for every option on the menu */ }

//Principal imports
import React from 'react';
import '../css/Menu.css';

//Function to create and represent nav buttons
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
                <div className="bottom">
                    <a href="/encuestas" className="button">Encuestas</a>
                </div>
            </div>
        </div>
    );
}

export default Menu;
