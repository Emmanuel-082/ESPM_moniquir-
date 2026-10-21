/**
 * api.js
 * Comunicación con el back-end (la API de Node.js de la AA5).
 * Las páginas de registro e inicio de sesión usan esta función,
 * así todo el código de red queda en un solo lugar.
 */

/**
 * Envía el correo y la contraseña a una ruta de la API usando POST.
 * @param {string} ruta - Endpoint, por ejemplo CONFIG.RUTA_LOGIN.
 * @param {string} correo - Correo escrito en el formulario.
 * @param {string} contrasena - Contraseña escrita en el formulario.
 * @param {object} [extras] - Datos adicionales del registro (nombre, cédula, teléfono).
 * @returns {Promise<{ok: boolean, mensaje: string, nombre: string}>} Resultado simplificado.
 */
async function enviarCredenciales(ruta, correo, contrasena, extras) {
  // Modo de prueba: no se llama a la API real
  if (CONFIG.USAR_SIMULACION) {
    return simularRespuesta(ruta, correo, contrasena, extras || {});
  }

  // Armamos el cuerpo de la petición con los nombres de campo de config.js
  const cuerpo = {};
  cuerpo[CONFIG.CAMPO_USUARIO] = correo;
  cuerpo[CONFIG.CAMPO_CONTRASENA] = contrasena;

  // Solo se envían los datos personales si la configuración lo permite
  if (CONFIG.ENVIAR_DATOS_PERSONALES && extras) {
    Object.assign(cuerpo, extras);
  }

  try {
    // fetch hace la petición HTTP; "await" espera la respuesta antes de seguir
    const respuesta = await fetch(CONFIG.API_URL + ruta, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    });

    // Intentamos leer la respuesta como JSON; si no se puede, usamos un objeto vacío
    const datos = await respuesta.json().catch(function () {
      return {};
    });

    // La API puede devolver el texto en "mensaje", "message" o "error"
    const textoApi = datos.mensaje || datos.message || datos.error;

    return {
      ok: respuesta.ok, // true si el código HTTP es 200-299
      mensaje: textoApi || (respuesta.ok ? "Operación exitosa." : "Error de autenticación."),
      nombre: datos.nombre || ""
    };
  } catch (error) {
    // Se llega aquí si la API está apagada o la dirección es incorrecta
    return {
      ok: false,
      mensaje: "No se pudo conectar con el servidor. Verifica que la API esté encendida.",
      nombre: ""
    };
  }
}

/**
 * MODO DE PRUEBA: imita a la API guardando los usuarios en localStorage.
 * Solo se usa cuando CONFIG.USAR_SIMULACION es true.
 */
function simularRespuesta(ruta, correo, contrasena, extras) {
  const usuarios = JSON.parse(localStorage.getItem("espm_usuarios_simulados") || "{}");
  const clave = correo.toLowerCase();

  // Registro: crea el usuario si no existe
  if (ruta === CONFIG.RUTA_REGISTRO) {
    if (usuarios[clave]) {
      return { ok: false, mensaje: "Ya existe una cuenta con ese correo.", nombre: "" };
    }
    usuarios[clave] = { contrasena: contrasena, nombre: extras.nombre || "" };
    localStorage.setItem("espm_usuarios_simulados", JSON.stringify(usuarios));
    return { ok: true, mensaje: "Usuario registrado correctamente.", nombre: extras.nombre || "" };
  }

  // Login: compara la contraseña guardada
  if (usuarios[clave] && usuarios[clave].contrasena === contrasena) {
    return { ok: true, mensaje: "Autenticación satisfactoria.", nombre: usuarios[clave].nombre };
  }
  return { ok: false, mensaje: "Error en la autenticación: correo o contraseña incorrectos.", nombre: "" };
}
