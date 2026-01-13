
// Constante para configuración
export const API_URL = 'api'; 

// Formateador de moneda compartido
export const formateadorEuro = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
});

export const formateadorDolar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export const formateadorLibra = new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: 'GBP'
});

// Manejo de Sesión
export function obtenerToken() {
    return localStorage.getItem('token');
}

export function guardarSesion(token, rol) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
}

export function cerrarSesion() {
    //localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    window.location.href = 'index.html';
}

export function verificarSesion(rolRequerido = null) {
    const token = obtenerToken();
    const rol = localStorage.getItem('rol');

    if (!token) {
        window.location.href = 'index.html';
        return null;
    }

    if (rolRequerido && rol !== rolRequerido) {
        alert("Acceso no autorizado");
        window.location.href = 'index.html';
        return null;
    }

    return token;
}