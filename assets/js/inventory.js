// assets/js/inventory.js

(function () {
  // utilidades
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // Toast simple
  window.showMessage = function (message) {
    const note = document.createElement('div');
    note.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      color: #fff; padding: .85rem 1.1rem; border-radius: 12px;
      z-index: 9999; font-weight: 800; box-shadow: 0 15px 30px rgba(124,58,237,.35);
      animation: inv-slide-in .25s ease-out;
    `;
    note.textContent = message;
    document.body.appendChild(note);
    setTimeout(() => {
      note.style.animation = 'inv-slide-out .25s ease-in';
      setTimeout(() => note.remove(), 250);
    }, 2500);
  };

  // Animaciones para el toast
  const style = document.createElement('style');
  style.textContent = `
    @keyframes inv-slide-in { from {opacity:0; transform: translateX(20px)} to {opacity:1; transform: translateX(0)}}
    @keyframes inv-slide-out { from {opacity:1; transform: translateX(0)} to {opacity:0; transform: translateX(20px)}}
  `;
  document.head.appendChild(style);

  // Selección de filas (clic en la fila excepto botones)
  function wireRowSelection() {
    $$('.product-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        row.classList.toggle('selected');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireRowSelection();
    console.log('📦 Inventory JS listo');
  });
})();
