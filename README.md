# ESPM Moniquirá Conecta — Front-end

Evidencia **GA7-220501096-AA4-EV03** · Componente front-end del proyecto formativo.

Portal web de la Empresa de Servicios Públicos de Moniquirá (ESPM), desarrollado con
**HTML5, CSS3 y JavaScript** (sin librerías externas), siguiendo los prototipos
del proyecto formativo. El registro y el inicio de sesión se conectan con la API de
Node.js de la evidencia AA5 (servicio web de registro e inicio de sesión).

## Pantallas

| Archivo | Descripción |
|---|---|
| `index.html` | Inicio: aviso de corte, carrusel, estadísticas, servicios y últimos comunicados |
| `login.html` | Iniciar sesión con correo y contraseña |
| `registro.html` | Crear cuenta en 3 pasos (datos personales, credenciales, confirmación) |
| `recuperar.html` | Recuperar contraseña |
| `facturas.html` | Consulta y pago de facturas por número de cuenta o cédula |
| `pqr.html` | Radicar PQR y consultar su estado por cédula |
| `noticias.html` | Noticias y comunicados con buscador y filtros |
| `contacto.html` | Datos de contacto y formulario de mensaje |

## Navegación

- La barra superior (Inicio, Facturas, PQR, Noticias, Contacto) está en todas las páginas del portal.
- **Iniciar Sesión** lleva a `login.html`; al entrar, el botón cambia a **Cerrar Sesión**.
- Desde el login: ¿Olvidaste tu contraseña? → `recuperar.html` · Regístrate → `registro.html`.
- **Pagar Factura** lleva a `facturas.html`.

## Estructura del proyecto

```
moniquira-conecta-frontend/
├── index.html, login.html, registro.html, recuperar.html,
│   facturas.html, pqr.html, noticias.html, contacto.html
├── css/
│   ├── base.css        Colores, botones, barra de navegación, pie y formularios
│   ├── auth.css        Login, registro y recuperar (diseño en dos columnas)
│   └── portal.css      Inicio, facturas, PQR, noticias y contacto
├── js/
│   ├── config.js       Dirección y rutas de la API (único archivo a ajustar)
│   ├── api.js          Comunicación con la API (fetch) y modo de prueba
│   ├── utilidades.js   Sesión, validaciones, errores y avisos
│   ├── iconos.js       Iconos SVG
│   ├── datos.js        Datos de ejemplo (noticias, facturas, PQR)
│   ├── componentes.js  Barra de navegación y pie de página compartidos
│   └── (un archivo por página: login, registro, recuperar, inicio,
│        facturas, pqr, noticias, contacto)
└── img/logo-espm.png
```

## Cómo ejecutarlo

1. Abre `index.html` en el navegador (o usa la extensión **Live Server** de VS Code).
2. Por defecto funciona en **modo de prueba** (`USAR_SIMULACION: true` en `js/config.js`):
   los usuarios se guardan en el navegador y no hace falta encender la API.

### Conectar con la API de la AA5

1. Enciende la API (por ejemplo `npm start`).
2. En `js/config.js` pon `USAR_SIMULACION: false` y verifica `API_URL`,
   `RUTA_REGISTRO`, `RUTA_LOGIN` y los nombres de campo (el correo viaja como `usuario`).
3. Si el navegador bloquea las peticiones por CORS, en la API instala `cors`
   (`npm install cors`) y agrega `app.use(cors())`.

## Datos de ejemplo para probar

- Facturas: cuenta `001-2345-6` o cédula `1234567890`.
- PQR: cédula `1234567890` (muestra dos PQR de ejemplo y las que radiques).
- Registro e inicio de sesión: crea una cuenta en `registro.html` y úsala en `login.html`.

## Requisitos del proyecto cubiertos

| Requisito | Dónde se ve |
|---|---|
| REQ-001 Autenticación | `login.html`, `registro.html` (HTTPS depende del servidor donde se publique) |
| REQ-002 Gestión de facturación | `facturas.html` |
| REQ-003 Notificaciones de vencimientos | Aviso de factura pendiente en `facturas.html` y aviso de cortes en `index.html` |
| REQ-005 Accesible desde móvil, tablet y PC | Diseño adaptable (menú de hamburguesa y columnas que se reorganizan) |

## Estándares de codificación

- Comentarios en español en todos los archivos.
- Nombres descriptivos en español (camelCase en JavaScript, minúsculas con guiones en CSS).
- Un archivo de JavaScript por responsabilidad; estilos con variables de color en `:root`.
- Validación de formularios en el front-end y texto de usuario escapado antes de mostrarlo en pantalla.
- Control de versiones con Git/GitHub.
