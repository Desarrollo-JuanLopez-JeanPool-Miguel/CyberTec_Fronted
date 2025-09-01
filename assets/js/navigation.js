// assets/js/navigation.js
// Sistema de navegación para CyberTec Gaming Store

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 CyberTec Gaming Store - Sistema cargado');
    
    // Inicializar componentes
    initNavigation();
    initSearchBar();
    initTimer();
    initAnimations();
});

// ==========================================================================
// Navegación
// ==========================================================================
function initNavigation() {
    // Destacar enlace activo
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
        
        // Efecto hover mejorado
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================================================
// Barra de búsqueda
// ==========================================================================
function initSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Simular búsqueda (solo visual)
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    console.log('🔍 Búsqueda:', searchTerm);
                    // Aquí irá la lógica de búsqueda real
                    showSearchResults(searchTerm);
                }
            }
        });
    }
}

function showSearchResults(term) {
    // Simulación de resultados de búsqueda
    const resultsContainer = document.querySelector('#search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="search-result">
                <h3>Resultados para: "${term}"</h3>
                <p>Se encontraron productos relacionados con gaming...</p>
            </div>
        `;
    }
}

// ==========================================================================
// Timer de ofertas
// ==========================================================================
function initTimer() {
    const timerElement = document.querySelector('.countdown');
    
    if (timerElement) {
        // Configurar tiempo objetivo (ejemplo: 24 horas desde ahora)
        const targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const timeLeft = targetTime - now;
            
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                timerElement.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timerElement.textContent = '¡OFERTA TERMINADA!';
                timerElement.style.color = '#ef4444';
            }
        };
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }
}

// ==========================================================================
// Animaciones
// ==========================================================================
function initAnimations() {
    // Observer para animaciones al scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos que necesitan animación
    const elementsToAnimate = document.querySelectorAll(
        '.category-card, .deal-card, .stat'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// ==========================================================================
// Funciones de navegación entre páginas
// ==========================================================================
function navigateTo(page) {
    console.log(`🔄 Navegando a: ${page}`);
    
    // Simular loading
    showLoading();
    
    setTimeout(() => {
        window.location.href = page;
    }, 500);
}

function showLoading() {
    // Crear overlay de loading
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-icon">⚡</div>
            <div class="loading-text">Cargando CyberTec...</div>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    setTimeout(() => {
        if (document.body.contains(loadingOverlay)) {
            document.body.removeChild(loadingOverlay);
        }
    }, 3000);
}

// ==========================================================================
// Event Listeners para botones principales
// ==========================================================================
document.addEventListener('click', function(e) {
    // Cart button
    if (e.target.closest('[href="cart.html"]')) {
        e.preventDefault();
        navigateTo('cart.html');
    }
    
    // Product page
    if (e.target.closest('[href="product.html"]')) {
        e.preventDefault();
        navigateTo('product.html');
    }
    
    // PC Builder
    if (e.target.closest('[href="builder.html"]')) {
        e.preventDefault();
        navigateTo('builder.html');
    }
    
    // Admin access (oculto)
    if (e.target.closest('.admin-link')) {
        e.preventDefault();
        const password = prompt('🔐 Acceso Admin - Contraseña:');
        if (password === 'admin123') {
            navigateTo('admin/dashboard.html');
        } else {
            alert('❌ Contraseña incorrecta');
        }
    }
});

// ==========================================================================
// Utilidades
// ==========================================================================
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

function getRandomProductId() {
    return Math.floor(Math.random() * 1000) + 1;
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Exportar funciones para uso global
window.CyberTecStore = {
    navigateTo,
    showNotification,
    formatPrice,
    getRandomProductId
};