const CLAVE_CARRITO = 'carrito_compras';

export const carrito = {
    items: JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [],

    agregar(producto) {
        const existente = this.items.find(i => i.id === producto.id);
        if (existente) {
            existente.cantidad++;
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: parseFloat(producto.precio), // Aseguramos que sea número
                cantidad: 1
            });
        }
        this.guardar();
    },

    obtenerTotal() {
        return this.items.reduce((suma, i) => suma + (i.precio * i.cantidad), 0);
    },

    limpiar() {
        this.items = [];
        this.guardar();
    },

    guardar() {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(this.items));
    }
};