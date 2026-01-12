document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-login');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar recarga de página

        const usuario = document.getElementById('usuario').value;
        const clave = document.getElementById('clave').value;

        try {
            const respuesta = await fetch('api/autenticacion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: usuario, clave: clave })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem('token', datos.token);
                localStorage.setItem('rol', datos.rol);
                
                // Redirección según rol
                if (datos.rol === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'tienda.html';
                }
            } else {
                alert(datos.error || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error de conexión con el servidor");
        }
    });
});