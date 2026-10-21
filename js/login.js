/**
 * login.js
 * Lógica de la pantalla de inicio de sesión (login.html).
 */

const formLogin = document.getElementById("formLogin");
const botonEnviar = document.getElementById("botonEnviar");

// Si ya hay una sesión activa, no tiene sentido ver el login: vamos al inicio
if (obtenerSesion()) {
  window.location.href = "index.html";
}

// Activa los botones del ojito (mostrar/ocultar contraseña)
activarOjos();

// El inicio de sesión con Google no está conectado en esta versión del front-end
document.getElementById("botonGoogle").addEventListener("click", function () {
  mostrarToast("El acceso con Google estará disponible próximamente.");
});

// "submit" ocurre cuando el usuario presiona el botón o la tecla Enter
formLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  limpiarErrores(formLogin);
  document.getElementById("mensaje").className = "mensaje";

  // --- Validaciones en el front-end ---
  let valido = true;

  if (correo === "") {
    marcarError("correo", "Escribe tu correo electrónico.");
    valido = false;
  } else if (!esCorreoValido(correo)) {
    marcarError("correo", "El correo no tiene un formato válido.");
    valido = false;
  }

  if (contrasena === "") {
    marcarError("contrasena", "Escribe tu contraseña.");
    valido = false;
  }

  if (!valido) return; // si algo falló, no llamamos a la API

  // Bloqueamos el botón mientras esperamos respuesta (evita doble clic)
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Ingresando...";

  const resultado = await enviarCredenciales(CONFIG.RUTA_LOGIN, correo, contrasena);
  mostrarMensaje("mensaje", resultado.ok, resultado.mensaje);

  if (resultado.ok) {
    // Si la API no devuelve el nombre, usamos la parte del correo antes de la @
    const nombre = resultado.nombre || correo.split("@")[0];
    guardarSesion(nombre, correo);

    // Pequeña pausa para que se alcance a leer el mensaje y pasamos al inicio
    setTimeout(function () {
      window.location.href = "index.html";
    }, 800);
  } else {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Ingresar";
  }
});
