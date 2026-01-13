import { peticion } from './modulos/api.js';
import { verificarSesion, cerrarSesion, formateadorEuro, mostrarMensaje } from './modulos/utilidades.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Si no es el rol admin sale, y la función redirige automáticamente
    const token = verificarSesion('admin');
    if (!token) return;

    document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);

    await cargarPedidos();
});

async function cargarPedidos() {
    try {
        const tbody = document.getElementById('lista-pedidos');

        // Petición limpia, sin headers manuales
        const pedidos = await peticion('pedidos.php');

        if (pedidos.length === 0) {
                mostrarMensaje("No hay pedidos registrados todavía.", "info");
        }
        
        tbody.innerHTML = pedidos.map(pedido=>{
            const items = JSON.parse(pedido.items_json);
            const detalleTexto = items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ');
            return `
                <tr>
                    <td>${pedido.id}</td>
                    <td>${pedido.usuario}</td>
                    <!-- Usamos el mismo formateador que en la tienda -->
                    <td>${formateadorEuro.format(pedido.total)}</td>
                    <td>${pedido.fecha}</td>
                    <td><small>${detalleTexto}</small></td>
                </tr>`;
        }).join('');
    } catch (error) {
        mostrarMensaje("Error al cargar los pedidos: " + error.message, "error");
    }
}
