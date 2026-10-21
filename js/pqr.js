/**
 * pqr.js
 * Lógica de la página de PQR (pqr.html):
 *   1. Pestañas (Radicar / Consultar estado)
 *   2. Selección de tipo y servicio
 *   3. Validación y envío del formulario
 *   4. Consulta del estado por cédula
 *
 * Las PQR radicadas se guardan en localStorage del navegador (modo demostración).
 * Para ver resultados de ejemplo, consulta la cédula 1234567890.
 */

const TAMANO_MAXIMO_ARCHIVO = 5 * 1024 * 1024; // 5 MB en bytes
const CLAVE_PQR = "espm_pqrs";

// Opciones elegidas en las tarjetas de "tipo" y "servicio"
const seleccion = { tipo: "", servicio: "" };

/* ============================================================
   1. PESTAÑAS
   ============================================================ */
const pestanaRadicar = document.getElementById("pestanaRadicar");
const pestanaConsultar = document.getElementById("pestanaConsultar");
const panelRadicar = document.getElementById("panelRadicar");
const panelConsultar = document.getElementById("panelConsultar");

/** Cambia entre las dos pestañas. */
function activarPestana(radicar) {
  pestanaRadicar.classList.toggle("activa", radicar);
  pestanaConsultar.classList.toggle("activa", !radicar);
  panelRadicar.classList.toggle("oculto", !radicar);
  panelConsultar.classList.toggle("oculto", radicar);
}

pestanaRadicar.addEventListener("click", function () { activarPestana(true); });
pestanaConsultar.addEventListener("click", function () { activarPestana(false); });

/* ============================================================
   2. TARJETAS DE SELECCIÓN (tipo de solicitud y servicio)
   ============================================================ */

/**
 * Hace que, dentro de un grupo de botones, solo uno quede elegido.
 * @param {string} idGrupo - id del contenedor de botones.
 * @param {string} campo - "tipo" o "servicio" (dónde guardar la elección).
 */
function activarGrupo(idGrupo, campo) {
  const grupo = document.getElementById(idGrupo);
  grupo.querySelectorAll(".opcion").forEach(function (boton) {
    boton.addEventListener("click", function () {
      grupo.querySelectorAll(".opcion").forEach(function (b) {
        b.classList.remove("elegida");
      });
      boton.classList.add("elegida");
      seleccion[campo] = boton.dataset.valor;
      document.getElementById("error-" + campo).textContent = "";
    });
  });
}

activarGrupo("grupoTipo", "tipo");
activarGrupo("grupoServicio", "servicio");

// Muestra el nombre del archivo elegido y valida su tamaño
document.getElementById("archivo").addEventListener("change", function () {
  const archivo = this.files[0];
  document.getElementById("textoArchivo").textContent = archivo
    ? "Archivo: " + archivo.name
    : "Adjuntar archivos (fotos, documentos) — máx. 5MB";
});

/* ============================================================
   3. ENVÍO DEL FORMULARIO
   ============================================================ */
const formPqr = document.getElementById("formPqr");

formPqr.addEventListener("submit", function (evento) {
  evento.preventDefault();
  limpiarErrores(formPqr);

  const nombre = document.getElementById("nombre").value.trim();
  const cedula = document.getElementById("cedula").value.trim();
  const telefono = document.getElementById("telefono").value.replace(/\s/g, "");
  const correo = document.getElementById("correo").value.trim();
  const cuenta = document.getElementById("cuenta").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const archivo = document.getElementById("archivo").files[0];

  // --- Validaciones ---
  let valido = true;

  if (seleccion.tipo === "") {
    document.getElementById("error-tipo").textContent = "Elige el tipo de solicitud.";
    valido = false;
  }
  if (seleccion.servicio === "") {
    document.getElementById("error-servicio").textContent = "Elige el servicio relacionado.";
    valido = false;
  }
  if (nombre.length < 3) {
    marcarError("nombre", "Escribe tu nombre completo.");
    valido = false;
  }
  if (!esCedulaValida(cedula)) {
    marcarError("cedula", "Entre 6 y 12 números.");
    valido = false;
  }
  if (!esTelefonoValido(telefono)) {
    marcarError("telefono", "Debe tener 10 números.");
    valido = false;
  }
  if (!esCorreoValido(correo)) {
    marcarError("correo", "Correo no válido.");
    valido = false;
  }
  // El número de cuenta es opcional, pero si se escribe debe tener formato válido
  if (cuenta !== "" && !/^[0-9-]{5,15}$/.test(cuenta)) {
    marcarError("cuenta", "Usa solo números y guiones.");
    valido = false;
  }
  if (descripcion.length < 20) {
    marcarError("descripcion", "Describe tu caso con al menos 20 caracteres.");
    valido = false;
  }
  if (archivo && archivo.size > TAMANO_MAXIMO_ARCHIVO) {
    document.getElementById("error-archivo").textContent = "El archivo supera los 5 MB.";
    valido = false;
  }
  if (!valido) {
    // Llevamos la vista al primer error para que el usuario lo vea
    const primerError = document.querySelector(".invalido, .error:not(:empty)");
    if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // --- Guardamos la PQR y mostramos el número de radicado ---
  const radicado = generarRadicado();
  const pqrs = leerPqrGuardadas();
  pqrs.unshift({
    cedula: cedula,
    radicado: radicado,
    fecha: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
    tipo: seleccion.tipo,
    servicio: seleccion.servicio,
    descripcion: descripcion,
    estado: "Radicado"
  });
  localStorage.setItem(CLAVE_PQR, JSON.stringify(pqrs));

  const caja = document.getElementById("exitoPqr");
  caja.style.display = "block";
  caja.innerHTML =
    '<div class="mensaje exito" style="display:block;margin:0">' +
    icono("check-circle") + " ¡PQR radicada con éxito! Tu número de radicado es <strong>" + radicado +
    "</strong>. Guárdalo para consultar el estado con tu cédula.</div>";
  caja.scrollIntoView({ behavior: "smooth", block: "start" });

  // Limpiamos el formulario y las selecciones
  formPqr.reset();
  seleccion.tipo = "";
  seleccion.servicio = "";
  document.querySelectorAll(".opcion.elegida").forEach(function (b) {
    b.classList.remove("elegida");
  });
  document.getElementById("textoArchivo").textContent = "Adjuntar archivos (fotos, documentos) — máx. 5MB";
});

/** Lee de localStorage las PQR radicadas desde este navegador. */
function leerPqrGuardadas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PQR)) || [];
  } catch (error) {
    return [];
  }
}

/** Crea un número de radicado consecutivo, por ejemplo PQR-2026-0201. */
function generarRadicado() {
  const siguiente = (Number(localStorage.getItem("espm_pqr_contador")) || 200) + 1;
  localStorage.setItem("espm_pqr_contador", siguiente);
  return "PQR-" + new Date().getFullYear() + "-" + String(siguiente).padStart(4, "0");
}

/* ============================================================
   4. CONSULTA DE ESTADO POR CÉDULA
   ============================================================ */
const formConsulta = document.getElementById("formConsulta");
const contenedorPqr = document.getElementById("resultadosPqr");

formConsulta.addEventListener("submit", function (evento) {
  evento.preventDefault();
  limpiarErrores(formConsulta);

  const cedula = document.getElementById("cedulaConsulta").value.trim();

  if (!esCedulaValida(cedula)) {
    marcarError("cedulaConsulta", "Escribe una cédula válida (6 a 12 números).");
    contenedorPqr.innerHTML = "";
    return;
  }

  // Juntamos las PQR guardadas por el usuario con las de ejemplo
  const propias = leerPqrGuardadas().filter(function (p) {
    return p.cedula === cedula;
  });
  const lista = propias.concat(PQR_DEMO[cedula] || []);

  if (lista.length === 0) {
    contenedorPqr.innerHTML =
      '<div class="tarjeta sin-resultados">No encontramos PQR asociadas a la cédula <strong>' +
      escaparHtml(cedula) + "</strong>.</div>";
    return;
  }

  contenedorPqr.innerHTML = lista.map(function (p) {
    // Color de la etiqueta según el estado
    const colores = { "En revisión": "et-amarillo", "Resuelto": "et-verde", "Radicado": "et-azul" };
    return (
      '<div class="pqr-item">' +
        '<div class="cabecera"><h3>' + p.radicado + "</h3>" +
          '<span class="etiqueta ' + (colores[p.estado] || "et-azul") + '">' + p.estado + "</span></div>" +
        '<div class="meta">' + p.fecha + " · " + p.tipo + " — " + p.servicio + "</div>" +
        "<div>" + escaparHtml(p.descripcion) + "</div>" +
        '<div class="pie-item">' + icono("clock") + " Respuesta estimada: 15 días hábiles</div>" +
      "</div>"
    );
  }).join("");
});
