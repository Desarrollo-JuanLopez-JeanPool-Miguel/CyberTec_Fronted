/* ===== CyberTec Admin • Add Product (standalone) ===== */

// Toast minimal
function toast(message) {
  const n = document.createElement('div');
  n.className = 'ct-toast';
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(() => { if (n && n.parentNode) n.parentNode.removeChild(n); }, 2500);
}

function formatPrice(price) {
  return price ? '$' + parseInt(price, 10).toLocaleString('es-CO') : '$0';
}

function updatePreview() {
  const name = document.getElementById('productName')?.value || 'Nombre del Producto';
  const price = document.getElementById('productPrice')?.value;
  const categoryEl = document.getElementById('productCategory');
  const statusVal = document.getElementById('productStatus')?.value || 'draft';

  const titleEl = document.getElementById('previewTitle');
  const priceEl = document.getElementById('previewPrice');
  const catEl = document.getElementById('previewCategory');
  const dot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  if (titleEl) titleEl.textContent = name;
  if (priceEl) priceEl.textContent = formatPrice(price);
  if (catEl) {
    const txt = categoryEl?.selectedOptions?.[0]?.textContent || 'Categoría';
    catEl.textContent = txt;
  }

  if (dot && statusText) {
    dot.className = 'indicator-dot'; // reset
    if (statusVal === 'active') {
      dot.classList.add('dot-active');
      statusText.textContent = 'Activo';
    } else if (statusVal === 'inactive') {
      dot.style.background = '#ef4444';
      statusText.textContent = 'Inactivo';
    } else {
      dot.classList.add('dot-draft');
      statusText.textContent = 'Borrador';
    }
  }
}

function validateForm() {
  const name = document.getElementById('productName')?.value?.trim();
  const sku = document.getElementById('productSku')?.value?.trim();
  const category = document.getElementById('productCategory')?.value;
  const price = document.getElementById('productPrice')?.value;
  const stock = document.getElementById('productStock')?.value;

  const isValid = !!(name && sku && category && price && stock);
  const status = document.getElementById('validationStatus');

  if (status) {
    status.textContent = isValid
      ? 'Todos los campos requeridos están completos'
      : 'Complete los campos marcados con *';
    status.style.color = isValid ? '#9ff6d2' : '#fbd38d';
  }

  return isValid;
}

document.addEventListener('DOMContentLoaded', () => {
  // Inputs que actualizan preview
  ['productName','productPrice','productCategory','productStatus'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    }
  });

  // Validación en vivo
  document.querySelectorAll('.form-input, .form-select').forEach(el => {
    el.addEventListener('input', validateForm);
    el.addEventListener('change', validateForm);
  });

  // Imagen: preview
  const imageInput = document.getElementById('imageInput');
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const previewImg = document.getElementById('previewImage');
        if (previewImg) {
          previewImg.style.backgroundImage = `url(${evt.target.result})`;
          previewImg.style.backgroundSize = 'cover';
          previewImg.style.backgroundPosition = 'center';
          previewImg.textContent = '';
        }
      };
      reader.readAsDataURL(file);
      toast('📷 Imagen cargada correctamente');
    });
  }

  // Guardar borrador
  const saveDraft = document.getElementById('saveDraft');
  if (saveDraft) {
    saveDraft.addEventListener('click', () => {
      const status = document.getElementById('productStatus');
      if (status) status.value = 'draft';
      updatePreview();
      toast('📝 Producto guardado como borrador');
    });
  }

  // Publicar
  const publishBtn = document.getElementById('publishProduct');
  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      if (validateForm()) {
        const status = document.getElementById('productStatus');
        if (status) status.value = 'active';
        updatePreview();
        toast('✅ Producto publicado exitosamente');
        setTimeout(() => {
          window.location.href = 'catalog.html';
        }, 1400);
      } else {
        toast('❌ Complete todos los campos requeridos');
      }
    });
  }

  // Theme toggle (demo)
  const toggle = document.getElementById('toggleTheme');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('theme-light');
      toast(isLight ? '🌞 Tema claro' : '🌙 Tema oscuro');
    });
  }

  // Autogenerar SKU (si está vacío)
  const nameInput = document.getElementById('productName');
  const skuInput = document.getElementById('productSku');
  if (nameInput && skuInput) {
    nameInput.addEventListener('input', function () {
      if (!skuInput.value) {
        const name = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 12);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        skuInput.value = name ? `${name}-${random}` : '';
      }
    });
  }

  // Inicial
  validateForm();
  updatePreview();
});
