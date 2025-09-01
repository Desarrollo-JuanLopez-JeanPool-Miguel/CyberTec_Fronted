// assets/js/main.js

console.log("✅ Main.js cargado");

// Función de acceso al admin
window.adminAccess = function () {
  const password = prompt("🔐 Acceso Admin - Contraseña:");
  if (password === "cybertec2025") {
    window.location.href = "admin/dashboard.html";
  } else if (password !== null) {
    alert("❌ Contraseña incorrecta");
  }
};
