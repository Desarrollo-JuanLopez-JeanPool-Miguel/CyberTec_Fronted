/* ===== CyberTec Admin • Customers JS ===== */

// Toast function
function toast(message) {
  const n = document.createElement('div');
  n.className = 'ct-toast';
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(() => { if (n && n.parentNode) n.parentNode.removeChild(n); }, 2500);
}

// Count Up Animation
function countUp(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  let current = 0;
  const step = target / 50;
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString('es-CO');
      clearInterval(interval);
    } else {
      el.textContent = Math.floor(current).toLocaleString('es-CO');
    }
  }, 20);
}

// Filter customers
function filterCustomers(status) {
  const rows = document.querySelectorAll('.customer-row');
  rows.forEach(row => {
    if (status === 'all') {
      row.classList.remove('hidden');
    } else {
      const rowStatus = row.getAttribute('data-status');
      if (rowStatus === status) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    }
  });
}

// Search function
function searchCustomers(query) {
  const rows = document.querySelectorAll('.customer-row');
  const lowerQuery = query.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(lowerQuery)) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  
  // Animate stats
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => countUp(stat));

  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      filterCustomers(filter);
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length > 0) {
        searchCustomers(query);
      } else {
        filterCustomers('all');
      }
    });
  }

  // Action buttons with toast
  const actionBtns = document.querySelectorAll('[data-toast]');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toast(btn.getAttribute('data-toast'));
    });
  });

  // Export customers
  const exportBtn = document.getElementById('exportCustomers');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      toast('📊 Exportando lista de clientes (demo)');
    });
  }

  // Add customer
  const addBtn = document.getElementById('addCustomer');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      toast('➕ Abrir formulario nuevo cliente (demo)');
    });
  }

  // Theme toggle
  const toggle = document.getElementById('toggleTheme');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('theme-light');
      toast(isLight ? '🌞 Tema claro' : '🌙 Tema oscuro');
    });
  }

  // Pagination (demo)
  const pageButtons = document.querySelectorAll('.page-btn');
  pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!btn.classList.contains('active')) {
        pageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        toast('📄 Cargando página ' + btn.textContent);
      }
    });
  });
});