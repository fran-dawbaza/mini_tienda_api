import { peticion } from './modulos/api.js';
import { guardarSesion } from './modulos/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-login');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const clave = document.getElementById('clave').value;

        try {
            const datos = await peticion('autenticacion.php', 'POST', { usuario, clave });
            
            guardarSesion(datos.token, datos.rol);
            
            // Redirección
            window.location.href = datos.rol === 'admin' ? 'admin.html' : 'tienda.html';
            
        } catch (error) {
            alert(error.message);
        }
    });
});