import { peticion } from './modulos/api.js';
import { verificarAcceso, cerrarSesion } from './modulos/auth.js';

// Verificar si es admin
verificarAcceso('admin');

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('lista-pedidos');
    const btnSalir = document.getElementById('btn-cerrar-sesion');

    async function cargarPedidos() {
        try {
            const pedidos = await peticion('pedidos.php');
            tbody.innerHTML = '';

            pedidos.forEach(p => {
                const items = JSON.parse(p.items_json);
                const resumen = items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ');

                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.usuario}</td>
                    <td>${p.total}€</td>
                    <td>${p.fecha}</td>
                    <td><small>${resumen}</small></td>
                `;
                tbody.appendChild(fila);
            });
        } catch (error) {
            alert("Error cargando pedidos: " + error.message);
        }
    }

    btnSalir.addEventListener('click', cerrarSesion);

    cargarPedidos();
});