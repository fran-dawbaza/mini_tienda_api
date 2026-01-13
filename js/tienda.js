import { formateadorEuro, verificarSesion, cerrarSesion } from './modulos/utilidades.js';
import { peticion } from './modulos/api.js';

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let listaProductosGlobal = []; 

document.addEventListener('DOMContentLoaded', async () => {
    if (!verificarSesion()) return;

    const contenedorProductos = document.getElementById('lista-productos');
    const contenedorCarrito = document.getElementById('items-carrito');
        
    // Listeners generales
    document.getElementById('btn-comprar').addEventListener('click', finalizarCompra);
    document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);

    // Delegación de eventos 1: Añadir productos
    contenedorProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            //const id = parseInt(e.target.dataset.id);
            anadirAlCarrito(e.target.dataset.id);
        }
    });

    // Delegación de eventos 2: Eliminar productos
    contenedorCarrito.addEventListener('click', (e) => {
        // Verificamos si clickeó el botón de eliminar
        if (e.target.classList.contains('btn-eliminar')) {
            //const id = parseInt(e.target.dataset.id);
            eliminarDelCarrito(e.target.dataset.id);
        }
    });

    await cargarProductos();
    //actualizarVistaCarrito();
});

async function cargarProductos() {
    try {
        listaProductosGlobal = await peticion('productos.php');
        console.dir(listaProductosGlobal)
        renderizarProductos(listaProductosGlobal);
    } catch (error) {
        alert(error.message);
    }
}


function renderizarProductos(productos) {
    const contenedorProductos = document.getElementById('lista-productos');
    contenedorProductos.innerHTML = productos.map(producto=>`
        <div class="tarjeta">
            <h3>${producto.nombre}</h3>
            <p class="precio">${formateadorEuro.format(producto.precio)}</p>
            <button class="btn-agregar" data-id="${producto.id}">Añadir</button>
        </div>`).join('');
}


function anadirAlCarrito(id) {
    const producto = listaProductosGlobal.find(p => p.id === id); // Ojo ambos son cadenas
    if (!producto) return;

    const productoExistente = carrito.find(item => item.id === id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: producto.nombre,
            precio: parseFloat(producto.precio),
            cantidad: 1
        });
    }
    
    actualizarVistaCarrito();
}


function eliminarDelCarrito(id) {
    // Filtramos el array para quitar el elemento con ese ID
    carrito = carrito.filter(item => item.id !== id);
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    const contenedorCarrito = document.getElementById('items-carrito');

    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    const spanTotal = document.getElementById('total-carrito');

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
        spanTotal.innerText = formateadorEuro.format(0);
        return;
    }

    let total = 0;

    contenedorCarrito.innerHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="item-carrito">
                <div>
                    <strong>${item.nombre}</strong> <small>x${item.cantidad}</small>
                </div>
                <div style="display:flex; align-items:center;">
                    <span style="margin-right:10px;">${formateadorEuro.format(subtotal)}</span>
                    <button class="btn-eliminar" data-id="${item.id}" title="Eliminar">✕</button>
                </div>
            </div>`;
    }).join('');

    spanTotal.innerText = formateadorEuro.format(total);
    
    // Forzamos la animación de cambio de precio
    spanTotal.classList.remove('animacion-cambio');
    void spanTotal.offsetWidth; 
    spanTotal.classList.add('animacion-cambio');
}

async function finalizarCompra() {
    if (carrito.length === 0) return alert("Carrito vacío");
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    try {
        await peticion('pedidos.php', 'POST', { items: carrito, total: total });
        alert("¡Pedido realizado!");
        carrito = [];
        actualizarVistaCarrito();
    } catch (error) {
        alert("Error: " + error.message);
    }
}