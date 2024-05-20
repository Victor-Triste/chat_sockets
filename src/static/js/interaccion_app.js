let nombreUsuario;
var socket = io();

$(document).ready(function() {
    $("#btnAbrirModal").click();

    $("#userForm").submit(function(event) {
        event.preventDefault();
        nombreUsuario = $("#name").val().trim();
        if (nombreUsuario) {
            $("#cerrarModal").click();
            console.log("Nombre de usuario:", nombreUsuario);
        }
    });
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

//presionar enter dentro del contenedor del mensaje.
$("#mensaje").keypress(function(event) {
    if (event.which === 13) {
        event.preventDefault();
        $("#enviar").click();
    }
});

function agregarMensajes(mensaje) {
    const messageElement = document.createElement('div');
    const justify = mensaje.name === nombreUsuario ? 'end' : 'start';
    const bgColor = mensaje.name === nombreUsuario ? 'green' : 'zinc';
    const bgDarkColor = mensaje.name === nombreUsuario ? 'green' : 'zinc';

    messageElement.className = `flex items-end justify-${justify}`;
    let userNameSpan = '';

    if (mensaje.name !== nombreUsuario) {
        userNameSpan = `<span class="block text-xs text-gray-500 dark:text-gray-400">${mensaje.name}</span>`;
    }

    // messageElement.innerHTML = `<div class="bg-${bgColor}-200 dark:bg-${bgDarkColor}-700 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">${mensaje.message}</div>`;
    messageElement.innerHTML = `
        <div class="bg-${bgColor}-200 dark:bg-${bgDarkColor}-700 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
            ${userNameSpan}
            <div>${mensaje.message}</div>
        </div>
    `;
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