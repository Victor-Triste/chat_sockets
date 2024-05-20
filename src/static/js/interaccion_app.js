let nombreUsuario;
var socket = io();

$(document).ready(function() {
    solicitarNombreUsuario();
});

$(() => {
    $("#enviar").click(() => {
        enviarMensaje({
            message: $("#mensaje").val(),
            name: nombreUsuario
        });
        $("#mensaje").val(""); 
    });
    
    obtenerMensajes();
});

$("#mensaje").keypress(function(event) {
    if (event.which === 13) { // Verificar si la tecla presionada es "Enter"
        event.preventDefault(); // Evitar que se agregue un salto de línea en el campo de texto
        $("#enviar").click(); // Simular un clic en el botón enviar
    }
});

function solicitarNombreUsuario() {
    nombreUsuario = prompt("Por favor, ingresa tu nombre:");
    if (nombreUsuario) {
        mostrarChat();
        console.log("Nombre de usuario:", nombreUsuario);
    } else {
        solicitarNombreUsuario(); // Vuelve a solicitar el nombre si no se proporcionó uno
    }
}

function mostrarChat() {
    $("#contentMensajes").show();
    $("#mensaje").show();
    $("#enviar").show();
    obtenerMensajes();
    $("#nombre").prop("disabled", true); // Desactiva la entrada de nombre una vez que se proporciona
}

function agregarMensajes(mensaje) {
    const messageElement = document.createElement('div');
    const justify = mensaje.name === nombreUsuario ? 'end' : 'start';
    const bgColor = mensaje.name === nombreUsuario ? 'green' : 'zinc';
    const bgDarkColor = mensaje.name === nombreUsuario ? 'green' : 'zinc';

    messageElement.className = `flex items-end justify-${justify}`;
    messageElement.innerHTML = `<div class="bg-${bgColor}-200 dark:bg-${bgDarkColor}-700 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">${mensaje.message}</div>`;
    $("#contentMensajes").append(messageElement);
}

socket.on('mensaje', agregarMensajes);

function obtenerMensajes() {
    $.get('http://127.0.0.1:3000/mensajes', (data) => {
        data.forEach(agregarMensajes);
    });
}

function enviarMensaje(mensaje) {
    $.post('http://127.0.0.1:3000/mensajes', mensaje);
}