// js/modulos/api.js
import { obtenerToken, cerrarSesion, API_URL } from './utilidades.js';

/**
 * Wrapper para fetch que maneja autencicación y errores
 */
export async function peticion(endpoint, metodo = 'GET', cuerpo = null) {
    const token = obtenerToken();
    
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const config = {
        method: metodo,
        headers: headers
    };

    if (cuerpo) {
        config.body = JSON.stringify(cuerpo);
    }

    try {
        const respuesta = await fetch(`${API_URL}/${endpoint}`, config);

        // Si el token expiró (401), cerramos sesión automáticamente
        if (respuesta.status === 401) {
            cerrarSesion();
            //throw new Error("Sin permiso o sesión expirada");
        }

        // Leemos los datos que llegan en formato JSON
        const datos = await respuesta.json();

        // Si la respuesta no es correcta (diferente de los códigos 200 a 299)
        if (!respuesta.ok) {
            if (datos.error)
                throw new Error(datos.error + ', código ' + respuesta.status);
            else
                throw new Error("Error en la petición, código " + respuesta.status);
        }

        return datos;

    } catch (error) {
        console.error("Error API:", error);
        throw error; // Re-lanzamos el error para que lo maneje la vista
    }
}