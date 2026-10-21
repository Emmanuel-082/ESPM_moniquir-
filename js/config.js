/**
 * config.js
 * Configuración del front-end. Es el ÚNICO archivo que debes ajustar
 * para conectar estas pantallas con tu API de Node.js (la de la AA5).
 */
const CONFIG = {
  // Dirección donde corre tu API. Con "npm start" suele ser el puerto 3000.
  API_URL: "http://localhost:3000",

  // Rutas (endpoints) de tu API. Cópialas de tu archivo ENDPOINTS.txt de la AA5.
  RUTA_REGISTRO: "/registro",
  RUTA_LOGIN: "/login",

  // Nombres de los campos que espera tu API en el cuerpo (body) de la petición.
  // En el diseño se inicia sesión con CORREO, así que el correo viaja en el
  // campo que tu API llama "usuario". Si tu API usa otros nombres
  // (por ejemplo "email" y "password"), cámbialos aquí.
  CAMPO_USUARIO: "usuario",
  CAMPO_CONTRASENA: "contrasena",

  // El registro pide nombre, cédula y teléfono además del correo y la contraseña.
  // true  = se envían también a la API (úsalo solo si tu API los acepta).
  // false = solo se envían correo y contraseña (lo que recibía tu API de la AA5).
  ENVIAR_DATOS_PERSONALES: false,

  // true  = MODO DE PRUEBA: los usuarios se guardan en el navegador y el
  //         front-end funciona solo, sin necesitar la API encendida.
  // false = usa tu API real (debe estar encendida en API_URL).
  USAR_SIMULACION: true
};
