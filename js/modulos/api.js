import { obtenerToken, cerrarSesion } from './auth.js';

const RUTA_BASE = 'api/';

export async function peticion(endpoint, metodo = 'GET', datos = null) {
    const url = `${RUTA_BASE}${endpoint}`;
    
    const cabeceras = {
        'Content-Type': 'application/json'
    };

    // Si tenemos token, lo inyectamos automáticamente
    const token = obtenerToken();
    if (token) {
        cabeceras['Authorization'] = `Bearer ${token}`;
    }

    const opciones = {
        method: metodo,
        headers: cabeceras
    };

    if (datos) {
        opciones.body = JSON.stringify(datos);
    }

    try {
        const respuesta = await fetch(url, opciones);
        
        // Si el token expiró, no autorizado (401), cerramos sesión automáticamente
        if (respuesta.status === 401) {
            cerrarSesion();
            throw new Error("Sesión expirada");
        }

        const json = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error(json.error || "Error en la petición");
        }

        return json;
    } catch (error) {
        throw error;
    }
}