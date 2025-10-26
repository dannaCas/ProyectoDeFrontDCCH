// --- Manejo del modal de login (funciona en cualquier página) ---
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = function() {
      loginModal.style.display = 'block';
    };
    closeModal.onclick = function() {
      loginModal.style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    };
  }
});

// Capturamos el formulario
const form = document.getElementById("formLogin");

// Escuchamos el evento "submit"
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const contrasena = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cuenta: login, contrasena: contrasena })
    });

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.warn("Respuesta no JSON del servidor", parseErr);
      data = {};
    }

    if (res.ok) {
      const cuenta = data.usuario?.cuenta;
      if (cuenta) {
        // --- ALERTA EXITOSA ---
        Swal.fire({
          icon: 'success',
          title: 'Acceso concedido',
          html: `<b>Bienvenido, ${cuenta}</b>`,
          background: '#693192ff',        
          color: '#fff',                 
          confirmButtonText: 'Entrar',
          confirmButtonColor: '#8e2de2' 
        });

        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = cuenta;
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';
      } else {
        // --- ALERTA DE ERROR ---
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Respuesta incompleta del servidor.',
          background: '#d90429',       
          color: '#fff',
          confirmButtonText: 'Reintentar',
          confirmButtonColor: '#ff4f79'
        });
      }
    } else {
      // --- ALERTA DE ACCESO DENEGADO ---
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
        background: '#9d0208',       
        color: '#fff',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#ff5c8a'
      });

      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
    }

  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    // --- ALERTA DE ERROR DE CONEXIÓN ---
    Swal.fire({
      icon: 'warning',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
      background: '#8338ec',       
      color: '#fff',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#d168f5'
    });
  }
});
