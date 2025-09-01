// ====== helpers ======
function toast(message) {
  var n = document.createElement('div');
  n.className = 'ct-toast';
  n.textContent = message;
  n.style.cssText =
    'position:fixed;right:20px;top:20px;z-index:9999;background:linear-gradient(135deg,#7c3aed,#a855f7);' +
    'color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 20px 40px rgba(124,58,237,.35);font-weight:700;';
  document.body.appendChild(n);
  setTimeout(function () { if (n && n.parentNode) n.parentNode.removeChild(n); }, 2500);
}

function countUp(el) {
  var target = el.getAttribute('data-count') || el.textContent;
  // simple animation (no backticks)
  el.textContent = target; // efecto “instantáneo elegante”
  el.style.transition = 'filter .3s ease';
  el.style.filter = 'drop-shadow(0 0 10px rgba(255,255,255,.15))';
  setTimeout(function(){ el.style.filter='none'; }, 400);
}

// ====== events ======
document.addEventListener('DOMContentLoaded', function () {
  // KPIs counters
  var kpis = document.querySelectorAll('.kpi-value');
  for (var i = 0; i < kpis.length; i++) countUp(kpis[i]);

  // Quick action toasts
  var qa = document.querySelectorAll('[data-toast]');
  for (var j = 0; j < qa.length; j++) {
    qa[j].addEventListener('click', function () { toast(this.getAttribute('data-toast')); });
  }

  // Orders actions (demo)
  var orders = document.getElementById('ordersBody');
  if (orders) {
    orders.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'view') toast('👁️ Ver detalles (demo)');
      if (action === 'process') toast('⚡ Procesar orden (demo)');
    });
  }

  // Refresh (demo)
  var refresh = document.getElementById('refreshOrders');
  if (refresh) refresh.addEventListener('click', function(){ toast('↻ Órdenes actualizadas (demo)'); });

  // New order (demo)
  var newOrder = document.getElementById('newOrder');
  if (newOrder) newOrder.addEventListener('click', function(){ toast('➕ Crear nueva orden (demo)'); });

  // Theme toggle (muy simple)
  var toggle = document.getElementById('toggleTheme');
  if (toggle) {
    toggle.addEventListener('click', function(){
      var isDark = document.documentElement.classList.toggle('theme-light');
      toast(isDark ? '🌞 Tema claro' : '🌙 Tema oscuro');
    });
  }
});
