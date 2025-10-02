// === CONFIGURACIÓN GLOBAL ===
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let totalCarrito = 0;

// === EVENTOS DEL DOM ===
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    actualizarContadorCarrito();
    configurarAnimaciones();
    inicializarBootstrap();
});

// === INICIALIZACIÓN DE LA APLICACIÓN ===
function inicializarApp() {
    console.log('🍽️ Restaurante Sabor & Tradición - Sistema Iniciado');
    
    // Configurar tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Configurar animaciones al scroll
    if (typeof IntersectionObserver !== 'undefined') {
        configurarObservadorScroll();
    }
    
    // Cargar carrito persistente
    cargarCarritoLocalStorage();
}

// === GESTIÓN DEL CARRITO ===
function agregarAlCarrito(productoId, cantidad = 1) {
    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === productoId);
    
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        mostrarNotificacion('Producto actualizado en el carrito', 'success');
    } else {
        // Si no existe, agregarlo (necesitamos obtener los datos del producto)
        obtenerDatosProducto(productoId).then(producto => {
            if (producto) {
                carrito.push({
                    id: productoId,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: cantidad,
                    imagen: producto.imagen || 'default.jpg'
                });
                mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
                actualizarCarritoUI();
            }
        });
    }
    
    guardarCarritoLocalStorage();
    actualizarContadorCarrito();
    animarBotonCarrito();
}

function removerDelCarrito(productoId) {
    const index = carrito.findIndex(item => item.id === productoId);
    if (index > -1) {
        const producto = carrito[index];
        carrito.splice(index, 1);
        mostrarNotificacion(`${producto.nombre} removido del carrito`, 'info');
        actualizarCarritoUI();
        guardarCarritoLocalStorage();
        actualizarContadorCarrito();
    }
}

function actualizarCantidadCarrito(productoId, nuevaCantidad) {
    const producto = carrito.find(item => item.id === productoId);
    if (producto) {
        if (nuevaCantidad <= 0) {
            removerDelCarrito(productoId);
        } else {
            producto.cantidad = nuevaCantidad;
            actualizarCarritoUI();
            guardarCarritoLocalStorage();
            actualizarContadorCarrito();
        }
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito ya está vacío', 'warning');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        guardarCarritoLocalStorage();
        actualizarContadorCarrito();
        actualizarCarritoUI();
        mostrarNotificacion('Carrito vaciado', 'info');
    }
}

function calcularTotalCarrito() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('carritoContador');
    if (contador) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function toggleCarrito() {
    const carritoModal = document.getElementById('carritoModal');
    if (carritoModal) {
        const modal = new bootstrap.Modal(carritoModal);
        modal.show();
        actualizarCarritoUI();
    } else {
        // Si no existe el modal, crearlo dinámicamente
        crearModalCarrito();
    }
}

function actualizarCarritoUI() {
    const carritoItems = document.getElementById('carritoItems');
    const carritoTotal = document.getElementById('carritoTotal');
    
    if (!carritoItems) return;
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío</p>';
        if (carritoTotal) carritoTotal.textContent = '$0.00';
        return;
    }
    
    let html = '';
    carrito.forEach(item => {
        html += `
            <div class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.nombre}</h6>
                    <small class="text-muted">$${item.precio.toFixed(2)} c/u</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="actualizarCantidadCarrito(${item.id}, ${item.cantidad - 1})">-</button>
                    <span class="mx-2">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="actualizarCantidadCarrito(${item.id}, ${item.cantidad + 1})">+</button>
                    <button class="btn btn-sm btn-danger" onclick="removerDelCarrito(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    carritoItems.innerHTML = html;
    
    if (carritoTotal) {
        carritoTotal.textContent = `$${calcularTotalCarrito().toFixed(2)}`;
    }
}

// === PERSISTENCIA DEL CARRITO ===
function guardarCarritoLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// === OBTENER DATOS DEL PRODUCTO ===
async function obtenerDatosProducto(productoId) {
    try {
        const response = await fetch(`api/producto.php?id=${productoId}`);
        if (response.ok) {
            return await response.json();
        } else {
            // Fallback: datos simulados para desarrollo
            return {
                id: productoId,
                nombre: 'Producto',
                precio: 10.00,
                imagen: 'default.jpg'
            };
        }
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
        return null;
    }
}

// === SISTEMA DE NOTIFICACIONES ===
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.remove();
        }
    }, 4000);
}

// === ANIMACIONES ===
function animarBotonCarrito() {
    const carritoBtn = document.querySelector('.carrito-flotante');
    if (carritoBtn) {
        carritoBtn.classList.add('pulse');
        setTimeout(() => {
            carritoBtn.classList.remove('pulse');
        }, 1000);
    }
}

function configurarAnimaciones() {
    // Agregar clase fade-in-up a elementos que aparecen
    const elementos = document.querySelectorAll('.fade-in-up');
    elementos.forEach((elemento, index) => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            elemento.style.transition = 'all 0.6s ease';
            elemento.style.opacity = '1';
            elemento.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function configurarObservadorScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// === MODAL DEL CARRITO ===
function crearModalCarrito() {
    const modalHTML = `
        <div class="modal fade" id="carritoModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-shopping-cart me-2"></i>Mi Carrito
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="carritoItems"></div>
                    </div>
                    <div class="modal-footer">
                        <div class="me-auto">
                            <strong>Total: <span id="carritoTotal">$0.00</span></strong>
                        </div>
                        <button type="button" class="btn btn-outline-danger" onclick="vaciarCarrito()">
                            <i class="fas fa-trash me-2"></i>Vaciar
                        </button>
                        <button type="button" class="btn btn-success" onclick="procederAlCheckout()">
                            <i class="fas fa-credit-card me-2"></i>Proceder al Pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('carritoModal'));
    modal.show();
    actualizarCarritoUI();
}

// === CHECKOUT ===
function procederAlCheckout() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', 'warning');
        return;
    }
    
    window.location.href = 'checkout.php';
}

// === INICIALIZAR COMPONENTES DE BOOTSTRAP ===
function inicializarBootstrap() {
    // Verificar que Bootstrap esté cargado
    if (typeof bootstrap === 'undefined') {
        console.error('⚠️ Bootstrap no está cargado correctamente');
        return;
    }
    
    // Inicializar todos los dropdowns manualmente
    const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdowns.forEach(dropdown => {
        try {
            new bootstrap.Dropdown(dropdown);
        } catch (error) {
            console.error('Error al inicializar dropdown:', error);
        }
    });
    
    console.log('✅ Bootstrap inicializado correctamente - ' + dropdowns.length + ' dropdowns encontrados');
}

// === EXPORTAR FUNCIONES GLOBALES ===
window.agregarAlCarrito = agregarAlCarrito;
window.removerDelCarrito = removerDelCarrito;
window.actualizarCantidadCarrito = actualizarCantidadCarrito;
window.toggleCarrito = toggleCarrito;
window.vaciarCarrito = vaciarCarrito;
window.procederAlCheckout = procederAlCheckout;
window.mostrarNotificacion = mostrarNotificacion;

console.log('✅ JavaScript del restaurante cargado correctamente');