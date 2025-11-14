
console.log('🛒 Cart.js cargado y conectado al backend');

// ========== CONFIGURACIÓN ==========
const API_URL = 'http://localhost:8080/api';
let cart = null;

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación
    if (!AUTH.isAuthenticated()) {
        showNotification('⚠️ Debes iniciar sesión para ver tu carrito', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Cargar carrito del backend
    await loadCart();
});

// ========== FUNCIONES PRINCIPALES ==========

/**
 * Cargar carrito desde el backend
 */
async function loadCart() {
    try {
        showLoading();
        const response = await fetch(`${API_URL}/cart`, {
            headers: AUTH.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Error al cargar el carrito');
        }

        cart = await response.json();
        renderCart();
        updateSummary();
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al cargar el carrito', 'error');
        hideLoading();
    }
}

/**
 * Renderizar items del carrito
 */
function renderCart() {
    const container = document.querySelector('.cart-items');
    
    if (!cart || !cart.items || cart.items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p style="margin: 1rem 0;">Comienza a agregar productos increíbles</p>
                <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 1rem;">
                    Explorar Productos
                </a>
            </div>
        `;
        return;
    }

    // Renderizar items
    const itemsHTML = cart.items.map((item, index) => `
        <div class="cart-item" data-item-id="${item.id}" data-animated="true" style="animation-delay: ${index * 0.1}s">
            <div class="item-layout">
                <div class="item-image">${getCategoryIcon(item.productCategory)}</div>
                <div class="item-info">
                    <h3 class="item-title">${item.productName}</h3>
                    <div class="item-specs">${item.productBrand || 'Gaming Hardware'}</div>
                    <div class="item-badge badge-hot">EN STOCK</div>
                </div>
                <div class="quantity-section">
                    <div class="qty-label">Qty:</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                        <div class="qty-display">${item.quantity}</div>
                        <button class="qty-btn" onclick="updateQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="item-price">${formatPrice(item.totalPrice)}</div>
                <div class="remove-item" onclick="removeFromCart(${item.product.id})">🗑️ Remover</div>
            </div>
        </div>
    `).join('');

    // Insertar antes de las sugerencias
    const firstChild = container.firstElementChild;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = itemsHTML;
    
    while (tempDiv.firstChild) {
        container.insertBefore(tempDiv.firstChild, firstChild);
    }
}

/**
 * Actualizar cantidad de un producto
 */
async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        await removeFromCart(productId);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'PUT',
            headers: AUTH.getAuthHeaders(),
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al actualizar cantidad');
        }

        cart = await response.json();
        renderCart();
        updateSummary();
        showNotification('✅ Cantidad actualizada', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ ' + error.message, 'error');
    }
}

/**
 * Eliminar producto del carrito
 */
async function removeFromCart(productId) {
    if (!confirm('¿Eliminar este producto del carrito?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: AUTH.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }

        cart = await response.json();
        
        // Remover visualmente con animación
        const itemElement = document.querySelector(`[data-item-id="${productId}"]`);
        if (itemElement) {
            itemElement.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                itemElement.remove();
                renderCart();
                updateSummary();
            }, 300);
        }

        showNotification('🗑️ Producto eliminado', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al eliminar producto', 'error');
    }
}

/**
 * Vaciar carrito completo
 */
async function clearCart() {
    if (!confirm('¿Vaciar todo el carrito?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: AUTH.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Error al vaciar carrito');
        }

        cart = await response.json();
        renderCart();
        updateSummary();
        showNotification('🗑️ Carrito vaciado', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al vaciar carrito', 'error');
    }
}

/**
 * Actualizar resumen de precios
 */
function updateSummary() {
    if (!cart) return;

    document.getElementById('subtotal-display').textContent = formatPrice(cart.subtotal);
    document.getElementById('total-display').textContent = formatPrice(cart.total);

    // Actualizar contador de items
    const totalItems = cart.totalItems || 0;
    document.querySelector('.cart-info').textContent = `🛒 Gaming Cart (${totalItems})`;

    // Actualizar progreso
    const progress = Math.min((totalItems / 7) * 100, 100);
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('build-progress-text').textContent = 
        `🎮 Build Progress: ${totalItems}/7 componentes`;
    document.querySelector('.progress-label').textContent = 
        `${Math.round(progress)}% completado`;
}

// ========== UTILIDADES ==========

/**
 * Formatear precio en pesos colombianos
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

/**
 * Obtener ícono según categoría
 */
function getCategoryIcon(category) {
    const icons = {
        'GPU': '🎮',
        'CPU': '⚡',
        'RAM': '💾',
        'MOTHERBOARD': '🔌',
        'STORAGE': '💿',
        'PSU': '🔋',
        'CASE': '🖥️',
        'COOLING': '❄️',
        'MONITOR': '🖥️',
        'PERIPHERALS': '🎧'
    };
    return icons[category] || '📦';
}

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                     'linear-gradient(135deg, #7c3aed, #a855f7)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 700;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Mostrar loading
 */
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'cart-loading';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
    `;
    loading.innerHTML = '⏳ Cargando carrito...';
    document.body.appendChild(loading);
}

/**
 * Ocultar loading
 */
function hideLoading() {
    const loading = document.getElementById('cart-loading');
    if (loading) {
        document.body.removeChild(loading);
    }
}

// ========== EXPONER FUNCIONES GLOBALMENTE ==========
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.showNotification = showNotification;