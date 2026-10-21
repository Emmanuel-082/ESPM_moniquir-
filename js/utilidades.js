/**
 * utilidades.js
 * Funciones pequeñas que usan varias páginas:
 *   - manejo de la sesión del usuario
 *   - validaciones de formularios
 *   - mensajes de error y avisos (toast)
 */

/* ============================================================
   1. SESIÓN DEL USUARIO
   Se guarda en sessionStorage: se borra al cerrar la pestaña.
   ============================================================ */

const CLAVE_SESION = "espm_sesion";

/** Devuelve {nombre, correo} si hay sesión iniciada, o null si no. */
function obtenerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION));
  } catch (error) {
    return null;
  }
}

/** Guarda los datos del usuario que inició sesión. */
function guardarSesion(nombre, correo) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: nombre, correo: correo }));
}

/** Borra la sesión (cerrar sesión). */
function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}

/* ============================================================
   2. VALIDACIONES
   Cada función devuelve true si el dato es válido.
   ============================================================ */

/** Correo con formato básico: algo@dominio.ext */
function esCorreoValido(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto);
}

/** Cédula o NIT: solo números, entre 6 y 12 dígitos. */
function esCedulaValida(texto) {
  return /^\d{6,12}$/.test(texto);
}

/** Teléfono colombiano: 10 dígitos (celular o fijo con indicativo). */
function esTelefonoValido(texto) {
  return /^\d{10}$/.test(texto);
}

/* ============================================================
   3. ERRORES EN LOS CAMPOS
   Convención: el campo tiene id="correo" y su mensaje de error
   está en <span class="error" id="error-correo">.
   ============================================================ */

/** Pinta un campo en rojo y muestra su mensaje de error. */
function marcarError(idCampo, texto) {
  const campo = document.getElementById(idCampo);
  const mensaje = document.getElementById("error-" + idCampo);
  if (campo) campo.classList.add("invalido");
  if (mensaje) mensaje.textContent = texto;
}

/** Quita todos los errores visibles dentro de un formulario o contenedor. */
function limpiarErrores(contenedor) {
  contenedor.querySelectorAll(".invalido").forEach(function (campo) {
    campo.classList.remove("invalido");
  });
  contenedor.querySelectorAll(".error").forEach(function (mensaje) {
    mensaje.textContent = "";
  });
}

/**
 * Muestra un mensaje general (éxito o fallo) en el recuadro indicado.
 * @param {string} idCaja - id del div con clase "mensaje".
 * @param {boolean} exito - true = verde, false = rojo.
 * @param {string} texto - Texto a mostrar.
 */
function mostrarMensaje(idCaja, exito, texto) {
  const caja = document.getElementById(idCaja);
  if (!caja) return;
  caja.textContent = texto;
  caja.className = "mensaje " + (exito ? "exito" : "fallo");
}

/* ============================================================
   4. AVISO EMERGENTE (toast)
   ============================================================ */

let temporizadorToast = null;

/** Muestra un aviso breve en la esquina inferior derecha. */
function mostrarToast(texto) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.classList.add("visible");
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(function () {
    toast.classList.remove("visible");
  }, 3200);
}

/* ============================================================
   5. OTRAS AYUDAS
   ============================================================ */

/**
 * Convierte texto escrito por el usuario en texto seguro para insertar
 * dentro de HTML (evita que se ejecute código malicioso).
 */
function escaparHtml(texto) {
  const auxiliar = document.createElement("div");
  auxiliar.textContent = texto;
  return auxiliar.innerHTML;
}

/** Da formato de pesos colombianos: 85400 -> "$85.400". */
function formatearPesos(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

/**
 * Activa los botones del "ojito" que muestran u ocultan la contraseña.
 * En el HTML: <button class="ojo" data-objetivo="contrasena">.
 */
function activarOjos() {
  document.querySelectorAll(".ojo").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const campo = document.getElementById(boton.dataset.objetivo);
      const mostrando = campo.type === "text";
      campo.type = mostrando ? "password" : "text";
      boton.innerHTML = icono(mostrando ? "eye" : "eye-off");
      boton.setAttribute("aria-label", mostrando ? "Mostrar contraseña" : "Ocultar contraseña");
    });
  });
}
