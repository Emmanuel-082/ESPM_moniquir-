/**
 * datos.js
 * Datos de ejemplo del portal (noticias, facturas y PQR).
 * En un sistema completo estos datos vendrían de la base de datos
 * a través de la API; aquí se dejan fijos para demostrar el diseño.
 */

/* ---------- Noticias y comunicados ---------- */
// color: define el color del borde y de la etiqueta (rojo, amarillo, azul, naranja, verde)
const NOTICIAS = [
  {
    id: 1,
    tipo: "Corte",
    color: "rojo",
    fecha: "15 Jun 2025",
    titulo: "Corte programado de agua — Barrio Centro y Los Pinos",
    tituloCorto: "Corte programado Barrio Centro",
    resumen: "Por mantenimiento preventivo en la red de distribución principal, se realizará un corte de agua en los barrios Centro y Los Pinos.",
    detalle: "Recomendamos almacenar agua con anticipación y mantener cerradas las llaves durante el corte. El servicio se restablecerá de forma gradual al finalizar los trabajos.",
    horario: "8:00 AM - 4:00 PM"
  },
  {
    id: 2,
    tipo: "Mantenimiento",
    color: "amarillo",
    fecha: "18 Jun 2025",
    titulo: "Mantenimiento preventivo red de alcantarillado — Sector Norte",
    tituloCorto: "Mantenimiento red alcantarillado Sector Norte",
    resumen: "Trabajos de limpieza y mantenimiento en la red de alcantarillado del sector norte del municipio.",
    detalle: "Durante la jornada pueden presentarse olores temporales y cierres parciales de vía. Agradecemos su comprensión.",
    horario: "7:00 AM - 1:00 PM"
  },
  {
    id: 3,
    tipo: "Comunicado",
    color: "azul",
    fecha: "10 Jun 2025",
    titulo: "Nuevas tarifas de servicios públicos vigentes desde julio 2025",
    tituloCorto: "Nuevas tarifas vigentes desde julio 2025",
    resumen: "A partir del 1 de julio de 2025 entran en vigencia las nuevas tarifas aprobadas por la CRA para los servicios de acueducto, alcantarillado y aseo.",
    detalle: "Podrá consultar el detalle del cobro en su factura o comunicándose con la línea de atención al cliente.",
    horario: ""
  },
  {
    id: 4,
    tipo: "Corte",
    color: "naranja",
    fecha: "20 Jul 2025",
    titulo: "Suspensión servicio de aseo — Festivo 20 de julio",
    tituloCorto: "Suspensión servicio de aseo — Festivo",
    resumen: "Con motivo del festivo nacional del 20 de julio, no habrá servicio de recolección de basuras. La ruta se reprogramará para el 21 de julio.",
    detalle: "Pedimos sacar los residuos solo el día de la ruta reprogramada para evitar acumulación en las calles.",
    horario: "Todo el día"
  },
  {
    id: 5,
    tipo: "Comunicado",
    color: "verde",
    fecha: "05 Jun 2025",
    titulo: "Inauguración nuevo tanque de almacenamiento",
    tituloCorto: "Inauguración nuevo tanque de almacenamiento",
    resumen: "ESPM inaugura el nuevo tanque de almacenamiento de agua potable que mejorará la cobertura y presión del servicio en el municipio.",
    detalle: "La nueva infraestructura beneficiará a los sectores con baja presión y aumentará la reserva de agua del municipio.",
    horario: ""
  }
];

/* ---------- Facturas de ejemplo ---------- */
// La clave puede ser el número de cuenta o la cédula del suscriptor
const FACTURAS_DEMO = {
  "001-2345-6": {
    suscriptor: "Juan Pérez",
    cuenta: "001-2345-6",
    facturas: [
      { periodo: "Mayo 2025", valor: 85400, vence: "15 Jun 2025", estado: "Pendiente" },
      { periodo: "Abril 2025", valor: 79200, vence: "15 May 2025", estado: "Pagada" },
      { periodo: "Marzo 2025", valor: 81750, vence: "15 Abr 2025", estado: "Pagada" }
    ]
  }
};
// La misma información se puede buscar también por la cédula de ejemplo
FACTURAS_DEMO["1234567890"] = FACTURAS_DEMO["001-2345-6"];

/* ---------- PQR de ejemplo (consulta por cédula) ---------- */
const PQR_DEMO = {
  "1234567890": [
    {
      radicado: "PQR-2025-0189",
      fecha: "05 Jun 2025",
      tipo: "Reclamo",
      servicio: "Facturación",
      descripcion: "Cobro excesivo en factura de mayo",
      estado: "En revisión"
    },
    {
      radicado: "PQR-2025-0143",
      fecha: "20 May 2025",
      tipo: "Queja",
      servicio: "Agua Potable",
      descripcion: "Baja presión del agua sector Ospina",
      estado: "Resuelto"
    }
  ]
};
