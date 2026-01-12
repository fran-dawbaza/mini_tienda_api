document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Referencias al DOM
    const contenedorProductos = document.getElementById('lista-productos');
    const contenedorCarrito = document.getElementById('items-carrito');
    const spanTotal = document.getElementById('total-carrito');
    const btnComprar = document.getElementById('btn-comprar');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

    // Cargar productos
    async function cargarProductos() {
        try {
            const respuesta = await fetch('api/productos.php', {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (!respuesta.ok) throw new Error("Sesión expirada");

            const productos = await respuesta.json();
            contenedorProductos.innerHTML = ''; // Limpiar loader

            productos.forEach(prod => {
                // Crear elementos HTML nativamente
                const div = document.createElement('div');
                div.className = 'tarjeta';
                div.innerHTML = `
                    <h3>${prod.nombre}</h3>
                    <p>$${prod.precio}</p>
                `;
                
                // Botón añadir con Event Listener (No onclick inline)
                const boton = document.createElement('button');
                boton.innerText = 'Añadir';
                boton.className = 'btn-pequeno';
                boton.addEventListener('click', () => anadirAlCarrito(prod));
                
                div.appendChild(boton);
                contenedorProductos.appendChild(div);
            });
        } catch (error) {
            alert(error.message);
            cerrarSesion();
        }
    }

    function anadirAlCarrito(producto) {
        const existe = carrito.find(item => item.id === producto.id);
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: parseFloat(producto.precio), // Asegurar que sea número
                cantidad: 1
            });
        }
        actualizarVistaCarrito();
    }

    function actualizarVistaCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = "<p>Vacío</p>";
            spanTotal.innerText = "0.00";
            return;
        }

        contenedorCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>$${subtotal.toFixed(2)}</span>
            `;
            contenedorCarrito.appendChild(div);
        });

        spanTotal.innerText = total.toFixed(2);
    }

    async function finalizarCompra() {
        if (carrito.length === 0) return alert("El carrito está vacío");

        const total = carrito.reduce((suma, i) => suma + (i.precio * i.cantidad), 0);

        try {
            const respuesta = await fetch('api/pedidos.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token 
                },
                body: JSON.stringify({ items: carrito, total: total })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                alert("¡Pedido realizado con éxito!");
                carrito = [];
                actualizarVistaCarrito();
            } else {
                alert("Error: " + datos.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error al procesar el pedido");
        }
    }

    function cerrarSesion() {
        localStorage.clear();
        window.location.href = 'index.html';
    }

    // Event Listeners
    btnComprar.addEventListener('click', finalizarCompra);
    btnCerrarSesion.addEventListener('click', cerrarSesion);

    // Inicializar
    cargarProductos();
    actualizarVistaCarrito();
});