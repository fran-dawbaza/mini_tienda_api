document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'admin') {
        alert("Acceso denegado: Se requiere administrador");
        window.location.href = 'index.html';
        return;
    }

    const tbody = document.getElementById('lista-pedidos');
    const btnCerrar = document.getElementById('btn-cerrar-sesion');

    async function cargarPedidos() {
        try {
            const respuesta = await fetch('api/pedidos.php', {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (!respuesta.ok) throw new Error("Error cargando datos");

            const pedidos = await respuesta.json();
            
            tbody.innerHTML = '';
            
            pedidos.forEach(p => {
                const items = JSON.parse(p.items_json);
                // Mapear items para mostrar resumen
                const detalleTexto = items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ');
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.usuario}</td>
                    <td>$${p.total}</td>
                    <td>${p.fecha}</td>
                    <td><small>${detalleTexto}</small></td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
            alert("No se pudieron cargar los pedidos");
        }
    }

    btnCerrar.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    cargarPedidos();
});