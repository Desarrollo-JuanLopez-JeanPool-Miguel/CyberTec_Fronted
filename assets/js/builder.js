// -----------------------------
// Estado inicial
// -----------------------------
var selectedComponents = {
  cpu: { name: 'AMD Ryzen 7 7800X3D', price: 620000 },
  gpu: { name: 'RTX 4080 SUPER Gaming OC', price: 1890000 },
  ram: { name: 'Corsair Vengeance DDR5 32GB', price: 350000 }
};

var totalBudget = 3500000;
var estimatedMissing = 580000;

// -----------------------------
// Utilidades
// -----------------------------
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function fmt(n) {
  try {
    return Number(n).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });
  } catch (e) {
    // Fallback simple
    return '$' + Math.round(Number(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

// Notificación pequeña
function showMessage(message) {
  var el = document.createElement('div');
  el.style.cssText =
    'position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#7c3aed,#a855f7);' +
    'color:#fff;padding:1rem 1.5rem;border-radius:12px;z-index:10000;font-weight:700;' +
    'box-shadow:0 15px 35px rgba(124,58,237,.4);max-width:350px;';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(function () {
    if (document.body.contains(el)) document.body.removeChild(el);
  }, 3000);
}

// -----------------------------
// Totales y presupuesto
// -----------------------------
function updateTotals() {
  var keys = Object.keys(selectedComponents);
  var currentTotal = 0;
  for (var i = 0; i < keys.length; i++) {
    var c = selectedComponents[keys[i]];
    if (c && c.price) currentTotal += Number(c.price);
  }

  var totalEstimated = currentTotal + estimatedMissing;
  var remaining = totalBudget - totalEstimated;

  // Montos
  var elCurrent = $('#current-total');
  var elMissing = $('#missing-total');
  var elEstimated = $('#estimated-total');
  var elBudgetAmount = $('#budget-amount');
  var elBudgetRemaining = $('#budget-remaining');
  var elBudgetStatus = $('#budget-status');
  var elInstallments = $('#installments');

  if (elCurrent) elCurrent.textContent = fmt(currentTotal);
  if (elMissing) elMissing.textContent = fmt(estimatedMissing);
  if (elEstimated) elEstimated.textContent = fmt(totalEstimated);
  if (elBudgetAmount) elBudgetAmount.textContent = fmt(totalBudget);

  if (remaining >= 0) {
    if (elBudgetRemaining) {
      elBudgetRemaining.textContent = fmt(remaining) + ' restante';
      elBudgetRemaining.style.color = '#10b981'; // success
    }
    if (elBudgetStatus) {
      elBudgetStatus.textContent = 'Dentro del presupuesto ✓';
      if (elBudgetStatus.classList) elBudgetStatus.classList.add('budget-good');
    }
  } else {
    if (elBudgetRemaining) {
      elBudgetRemaining.textContent = fmt(remaining) + ' (excedido)';
      elBudgetRemaining.style.color = '#ef4444'; // danger
    }
    if (elBudgetStatus) {
      elBudgetStatus.textContent = '⚠️ Excede el presupuesto';
      if (elBudgetStatus.classList) elBudgetStatus.classList.remove('budget-good');
    }
  }

  // 12 cuotas
  if (elInstallments) {
    var cuota = Math.ceil(totalEstimated / 12);
    elInstallments.textContent = '💳 Cuotas sin interés: ' + fmt(cuota) + '/mes';
  }
}

// -----------------------------
// Compatibilidad
// -----------------------------
function updateCompatibility(score) {
  if (typeof score !== 'number') score = 90;
  var bar = $('#compatibility-bar');
  var label = $('#compatibility-score');
  if (bar) bar.style.width = score + '%';
  if (label) label.textContent = score + '% Compatible';
}

// -----------------------------
// Progreso (cuántos slots llenos)
// -----------------------------
function updateProgress() {
  var totalSlots = 7;
  var selectedCount = Object.keys(selectedComponents).length;
  var pct = Math.round((selectedCount / totalSlots) * 100);

  var t = $('#build-progress-text');
  var p = $('#progress-percentage');
  var b = $('#progress-bar');

  if (t) t.textContent = selectedCount + '/' + totalSlots + ' componentes • ' + pct + '% completado';
  if (p) p.textContent = selectedCount + '/' + totalSlots + ' componentes seleccionados';
  if (b) b.style.width = pct + '%';
}

// -----------------------------
// Templates de ejemplo
// -----------------------------
var templates = {
  '1440p': { msg: 'Build Gaming 1440p cargado', add: { storage: { name: 'SSD 1TB Gen4', price: 250000 } } },
  '4k': { msg: 'Build 4K Ultra cargado', add: { psu: { name: 'PSU 1000W Gold', price: 520000 } } },
  'streaming': { msg: 'Build Streaming cargado', add: { storage: { name: 'SSD 2TB Gen4', price: 430000 } } },
  'competitive': { msg: 'Build Competitivo cargado', add: {} },
  'creator': { msg: 'Build Creator cargado', add: {} },
  'beast': { msg: '🔥 Beast Mode Build cargado', add: { psu: { name: 'PSU 1200W Platinum', price: 780000 } } }
};

function loadTemplate(name) {
  var t = templates[name];
  if (!t) { showMessage('Template no encontrado'); return; }
  showMessage(t.msg);
  var add = t.add || {};
  for (var k in add) {
    if (Object.prototype.hasOwnProperty.call(add, k)) {
      selectedComponents[k] = add[k];
    }
  }
  updateTotals();
  updateProgress();
}

// -----------------------------
// Eventos
// -----------------------------
function wireEvents() {
  document.addEventListener('click', function (e) {
    var btn = e.target;
    // subir hasta encontrar un <button> si hacen click en un icono dentro
    while (btn && btn.tagName !== 'BUTTON') btn = btn.parentNode;
    if (!btn) return;

    var action = btn.getAttribute('data-action');
    var key = btn.getAttribute('data-key');

    if (action === 'add-cart') { showMessage('🛒 Función de agregar al carrito no implementada aún'); return; }
    if (action === 'save') { showMessage('💾 Función de guardar build no implementada aún'); return; }
    if (action === 'share') { showMessage('📤 Función de compartir no implementada aún'); return; }

    if (action === 'change') { showMessage('🔄 Cambiar componente: ' + (key ? key.toUpperCase() : '') + ' (demo)'); return; }
    if (action === 'select') { showMessage('🧩 Elegir componente para: ' + (key ? key.toUpperCase() : '') + ' (demo)'); return; }
  });

  // Botones de templates
  var btns = $$('.build-template');
  for (var i = 0; i < btns.length; i++) {
    (function (b) {
      b.addEventListener('click', function () {
        var name = (b.dataset && b.dataset.template) ? b.dataset.template : b.getAttribute('data-template');
        loadTemplate(name);
      });
    })(btns[i]);
  }
}

// -----------------------------
// Animaciones de entrada (opcionales)
// -----------------------------
function animateComponentsIn() {
  var items = $$('.component-item');
  for (var i = 0; i < items.length; i++) {
    var el = items[i];
    // si tienes CSS para .appear, se verá suave
    if (el.classList) el.classList.add('appear');
  }

  // Transiciones para barras
  setTimeout(function () {
    var prog = $('#progress-bar');
    var comp = $('#compatibility-bar');
    if (prog) prog.style.transition = 'width 2s ease';
    if (comp) comp.style.transition = 'width 2s ease';
  }, 400);
}

// -----------------------------
// Inicio
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
  wireEvents();
  updateTotals();
  updateCompatibility(90);
  updateProgress();
  animateComponentsIn();
});