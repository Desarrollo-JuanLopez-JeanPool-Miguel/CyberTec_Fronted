// assets/js/api.js
/**
 * Cliente API para conectar el backend
 */

const API = {
    BASE_URL: 'http://localhost:8080/api',

    // ========== AUTH ==========
    async login(username, password) {
        const response = await fetch(`${this.BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    },

    async register(userData) {
        const response = await fetch(`${this.BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    // ========== PRODUCTS ==========
    async getProducts() {
        const response = await fetch(`${this.BASE_URL}/products`);
        return await response.json();
    },

    async getProductById(id) {
        const response = await fetch(`${this.BASE_URL}/products/${id}`);
        return await response.json();
    },

    async getProductsByCategory(category) {
        const response = await fetch(`${this.BASE_URL}/products/category/${category}`);
        return await response.json();
    },

    async createProduct(product) {
        const response = await fetch(`${this.BASE_URL}/products`, {
            method: 'POST',
            headers: AUTH.getAuthHeaders(),
            body: JSON.stringify(product)
        });
        return await response.json();
    },

    async updateProduct(id, product) {
        const response = await fetch(`${this.BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: AUTH.getAuthHeaders(),
            body: JSON.stringify(product)
        });
        return await response.json();
    },

    async deleteProduct(id) {
        const response = await fetch(`${this.BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: AUTH.getAuthHeaders()
        });
        return await response.json();
    },

    async getInventoryStats() {
        const response = await fetch(`${this.BASE_URL}/products/stats`, {
            headers: AUTH.getAuthHeaders()
        });
        return await response.json();
    },

    // ========== CART ==========
    async getCart() {
        const response = await fetch(`${this.BASE_URL}/cart`, {
            headers: AUTH.getAuthHeaders()
        });
        return await response.json();
    },

    async addToCart(productId, quantity) {
        const response = await fetch(`${this.BASE_URL}/cart/items`, {
            method: 'POST',
            headers: AUTH.getAuthHeaders(),
            body: JSON.stringify({ productId, quantity })
        });
        return await response.json();
    },

    async removeFromCart(productId) {
        const response = await fetch(`${this.BASE_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: AUTH.getAuthHeaders()
        });
        return await response.json();
    },

   async updateCartItem(productId, quantity) {
    const response = await fetch(`${this.BASE_URL}/cart/items/${productId}`, {
        method: 'PUT',  // ← CORRECTO
        headers: AUTH.getAuthHeaders(),
        body: JSON.stringify({ quantity })
    });
    return await response.json();
},

    async clearCart() {
        const response = await fetch(`${this.BASE_URL}/cart`, {
            method: 'DELETE',
            headers: AUTH.getAuthHeaders()
        });
        return await response.json();
    },

    // ========== AI CHAT ==========
    async sendChatMessage(message) {
        const response = await fetch(`${this.BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        return await response.json();
    },

    async compareProducts(sku1, sku2) {
        const response = await fetch(`${this.BASE_URL}/ai/compare?sku1=${sku1}&sku2=${sku2}`);
        return await response.json();
    }
};

// Exponer globalmente
window.API = API;