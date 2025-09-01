/* ===== CyberTec Admin • Catalog (standalone) ===== */

// Toast mínimo
function toast(message) {
  var n = document.createElement('div');
  n.className = 'ct-toast';
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(function () { if (n && n.parentNode) n.parentNode.removeChild(n); }, 2500);
}

// Contador simple (visual)
function countUp(el) {
  var target = el.getAttribute('data-count') || el.textContent;
  el.textContent = target;
  el.style.transition = 'filter .3s ease';
  el.style.filter = 'drop-shadow(0 0 10px rgba(255,255,255,.15))';
  setTimeout(function(){ el.style.filter='none'; }, 400);
}

document.addEventListener('DOMContentLoaded', function () {
  // Stats counters
  var stats = document.querySelectorAll('.stat-number');
  for (var i = 0; i < stats.length; i++) countUp(stats[i]);

  // Botones que muestran toast
  var toastBtns = document.querySelectorAll('[data-toast]');
  for (var j = 0; j < toastBtns.length; j++) {
    toastBtns[j].addEventListener('click', function () { 
      toast(this.getAttribute('data-toast')); 
    });
  }

  // Filtros
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-card');

  function applyFilter(filterValue) {
    for (var m = 0; m < productCards.length; m++) {
      var card = productCards[m];
      var category = card.getAttribute('data-category');
      var status = card.getAttribute('data-status');

      var show = false;
      if (filterValue === 'all') show = true;
      else if (filterValue === 'active' && status === 'active') show = true;
      else if (filterValue === 'draft' && status === 'draft') show = true;
      else if (filterValue === category) show = true;

      card.style.display = show ? 'block' : 'none';
    }
  }

  for (var k = 0; k < filterBtns.length; k++) {
    filterBtns[k].addEventListener('click', function() {
      // Active visual
      for (var l = 0; l < filterBtns.length; l++) {
        filterBtns[l].classList.remove('active');
      }
      this.classList.add('active');

      var filterValue = this.getAttribute('data-filter');
      applyFilter(filterValue);
      toast('🔍 Filtrado por: ' + this.textContent);
    });
  }

  // Acciones en lote (demo)
  var bulkBtn = document.getElementById('bulkActions');
  if (bulkBtn) {
    bulkBtn.addEventListener('click', function() {
      toast('📋 Acciones en lote (demo)');
    });
  }

  // Theme toggle (demo)
  var toggle = document.getElementById('toggleTheme');
  if (toggle) {
    toggle.addEventListener('click', function(){
      var isLight = document.documentElement.classList.toggle('theme-light');
      toast(isLight ? '🌞 Tema claro' : '🌙 Tema oscuro');
    });
  }
});
