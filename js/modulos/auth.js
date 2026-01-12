export const CLAVE_TOKEN = 'token_tienda';
export const CLAVE_ROL = 'rol_tienda';

export function guardarSesion(token, rol) {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_ROL, rol);
}

export function obtenerToken() {
    return localStorage.getItem(CLAVE_TOKEN);
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_ROL);
    window.location.href = 'index.html';
}

export function verificarAcceso(rolRequerido = null) {
    const token = obtenerToken();
    const rol = localStorage.getItem(CLAVE_ROL);

    if (!token) {
        window.location.href = 'index.html';
        return false;
    }

    if (rolRequerido && rol !== rolRequerido) {
        alert("No tienes permisos para ver esta página");
        window.location.href = 'index.html';
        return false;
    }

    return { token, rol }; // Devolvemos datos por si se necesitan
}