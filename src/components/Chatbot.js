import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const ChatbotComponent = () => {
    const theme = {
        background: '#f5f8fb',
        headerBgColor: '#e73c4c',
        headerFontColor: '#fff',
        headerFontSize: '20px',
        fontFamily: 'Signika bold',
        botBubbleColor: '#ececec',
        botFontColor: '#00000',
        botFontSize: '15px',
        userBubbleColor: '#e73c4c',
        userFontColor: '#fff',
        userFontSize: '15px',
    };

    const steps = [
        {
            id: '1',
            message: 'Hola, ¿cómo te llamas?',
            trigger: 'name',
        },
        {
            id: 'name',
            user: true,
            trigger: '3',
        },
        {
            id: '3',
            message: '¿Cuál es tu correo electrónico?',
            trigger: 'email',
        },
        {
            id: 'email',
            user: true,
            trigger: '5',
        },
        {
            id: '5',
            message: '¿En qué puedo ayudarte?',
            trigger: 'options',
        },
        {
            id: 'options',
            options: [
                { value: 'trámites', label: 'Trámites', trigger: 'trámites' },
                { value: 'noticias', label: 'Noticias', trigger: 'noticias' },
                { value: 'eventos', label: 'Eventos', trigger: 'eventos' },
                { value: 'funcionarios', label: 'Funcionarios', trigger: 'funcionarios' },
                { value: 'instituciones', label: 'Instituciones', trigger: 'instituciones' },
                { value: 'otro', label: 'Otro servicio', trigger: 'otro' },
            ],
        },
        {
            id: 'trámites',
            message: '¿Qué trámite deseas realizar?',
            trigger: 'trámites-options',
        },
        {
            id: 'trámites-options',
            options: [
                { value: 'acta', label: 'Acta de nacimiento', trigger: 'acta' },
                { value: 'cartilla', label: 'Cartilla militar', trigger: 'cartilla' },
                { value: 'predial', label: 'Pago predial', trigger: 'predial' },
            ],
        },
        {
            id: 'acta',
            message: 'Para tramitar tu acta de nacimiento, visita nuestra oficina...',
            trigger: 'more-help',
        },
        {
            id: 'cartilla',
            message: 'Para tramitar tu cartilla militar, visita nuestra oficina...',
            trigger: 'more-help',
        },
        {
            id: 'predial',
            message: 'Para realizar el pago predial, visita nuestra oficina...',
            trigger: 'more-help',
        },
        {
            id: 'noticias',
            message: 'En esta página tenemos las noticias más importantes de Santiago.',
            trigger: 'noticias-link',
        },
        {
            id: 'noticias-link',
            component: (
                <a href="/noticias" target="_blank" rel="noopener noreferrer">
                    Ir a Noticias
                </a>
            ),
            trigger: 'more-help',
        },
        {
            id: 'eventos',
            message: 'En esta página tenemos los eventos más recientes e importantes de Santiago.',
            trigger: 'eventos-link',
        },
        {
            id: 'eventos-link',
            component: (
                <a href="/eventos" target="_blank" rel="noopener noreferrer">
                    Ir a Eventos
                </a>
            ),
            trigger: 'more-help',
        },
        {
            id: 'funcionarios',
            message: 'En esta página tenemos el Directorio de nuestros funcionarios.',
            trigger: 'funcionarios-link',
        },
        {
            id: 'funcionarios-link',
            component: (
                <a href="/gobierno/directorio" target="_blank" rel="noopener noreferrer">
                    Ir a Directorio
                </a>
            ),
            trigger: 'more-help',
        },
        {
            id: 'instituciones',
            message: 'En esta página tenemos las instituciones más importantes de Santiago.',
            trigger: 'instituciones-link',
        },
        {
            id: 'instituciones-link',
            component: (
                <a href="/gobierno/institucion" target="_blank" rel="noopener noreferrer">
                    Ir a Instituciones
                </a>
            ),
            trigger: 'more-help',
        },
        {
            id: 'otro',
            message: '¿Cuál es tu situación?',
            trigger: 'situation',
        },
        {
            id: 'situation',
            user: true,
            trigger: 'situation-response',
        },
        {
            id: 'situation-response',
            message: 'Nos pondremos en contacto contigo para resolver tu situación.',
            trigger: 'more-help',
        },
        {
            id: 'more-help',
            message: '¿Te puedo ayudar con algo más?',
            trigger: 'help-options',
        },
        {
            id: 'help-options',
            options: [
                { value: 'sí', label: 'Sí', trigger: 'options' },
                { value: 'no', label: 'No', trigger: 'end' },
            ],
        },
        {
            id: 'end',
            message: 'Gracias por utilizar nuestros servicios. ¡Hasta luego!',
            end: true,
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <ChatBot steps={steps} floating={true} width="400px"/>
        </ThemeProvider>
    );
};

export default ChatbotComponent;
