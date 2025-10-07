// assets/js/auth.js
/**
 * Utilidades de Autenticación
 */

const AUTH = {
    API_URL: 'http://localhost:8080/api',

    // Obtener token del localStorage
    getToken() {
        return localStorage.getItem('token');
    },

    // Obtener usuario del localStorage
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Verificar si está autenticado
    isAuthenticated() {
        return !!this.getToken();
    },

    // Verificar si es admin
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'ADMIN';
    },

    // Guardar datos de autenticación
    saveAuth(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Cerrar sesión
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    },

    // Headers con autorización
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        };
    },

    // Proteger páginas (solo usuarios autenticados)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    },

    // Proteger páginas de admin
    requireAdmin() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }
        if (!this.isAdmin()) {
            alert('Acceso denegado. Se requieren permisos de administrador.');
            window.location.href = '/index.html';
            return false;
        }
        return true;
    }
};

// Exponer globalmente
window.AUTH = AUTH;