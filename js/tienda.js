import { peticion } from './modulos/api.js';
import { verificarAcceso, cerrarSesion } from './modulos/auth.js';
import { carrito } from './modulos/carrito.js';

// Verificar login antes de ejecutar nada
verificarAcceso();

document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const divProductos = document.getElementById('lista-productos');
    const divCarrito = document.getElementById('items-carrito');
    const spanTotal = document.getElementById('total-carrito');
    const btnComprar = document.getElementById('btn-comprar');
    const btnSalir = document.getElementById('btn-cerrar-sesion');

    // --- Funciones de Renderizado ---
    
    async function cargarProductos() {
        try {
            const productos = await peticion('productos.php');
            divProductos.innerHTML = ''; 

            productos.forEach(prod => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';
                tarjeta.innerHTML = `
                    <h3>${prod.nombre}</h3>
                    <p>${prod.precio}€</p>
                `;
                
                const boton = document.createElement('button');
                boton.innerText = 'Añadir';
                boton.className = 'btn-pequeno';
                boton.addEventListener('click', () => {
                    carrito.agregar(prod);
                    renderizarCarrito();
                });

                tarjeta.appendChild(boton);
                divProductos.appendChild(tarjeta);
            });
        } catch (error) {
            console.error(error);
            divProductos.innerHTML = '<p>Error cargando productos</p>';
        }
    }

    function renderizarCarrito() {
        if (carrito.items.length === 0) {
            divCarrito.innerHTML = "<p>Vacío</p>";
            spanTotal.innerText = "0.00";
            return;
        }

        divCarrito.innerHTML = '';
        carrito.items.forEach(item => {
            const fila = document.createElement('div');
            fila.className = 'item-carrito';
            fila.innerHTML = `
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>${(item.precio * item.cantidad).toFixed(2)}€</span>
            `;
            divCarrito.appendChild(fila);
        });

        spanTotal.innerText = carrito.obtenerTotal().toFixed(2);
    }

    async function procesarCompra() {
        if (carrito.items.length === 0) return alert("Carrito vacío");

        try {
            await peticion('pedidos.php', 'POST', {
                items: carrito.items,
                total: carrito.obtenerTotal()
            });

            alert("¡Pedido realizado con éxito!");
            carrito.limpiar();
            renderizarCarrito();
        } catch (error) {
            alert(error.message);
        }
    }

    // Eventos Globales
    btnComprar.addEventListener('click', procesarCompra);
    btnSalir.addEventListener('click', cerrarSesion);

    // Inicialización
    cargarProductos();
    renderizarCarrito();
});