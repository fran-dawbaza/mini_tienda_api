import { peticion } from './modulos/api.js';
import { guardarSesion,mostrarMensaje  } from './modulos/utilidades.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-login');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const clave = document.getElementById('clave').value;

        try {
            // Usamos nuestra función unificada 'peticion'
            // No hace falta poner 'api/' porque ya está definido en utilidades.js (API_URL)
            // si definiste API_URL como 'api/', entonces solo pasamos el endpoint:
            const datos = await peticion('autenticacion.php', 'POST', { 
                usuario: usuario, 
                clave: clave 
            });

            // Usamos la función centralizada para guardar token y rol
            guardarSesion(datos.token, datos.rol);

            // Mensaje de éxito antes de redirigir (opcional, pasa muy rápido)
            // mostrarMensaje("Login correcto, redirigiendo...", "exito");

            // Redirección
            if (datos.rol === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'tienda.html';
            }

        } catch (error) {
            // El error ya viene procesado desde api.js
            mostrarMensaje(error.message, 'error');
        }
    });
});