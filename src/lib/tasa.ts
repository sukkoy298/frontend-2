/** Utilidades de tasa: parseo robusto y formato venezolano. */

/**
 * Convierte el valor que devuelve la API a número.
 * Acepta number, "849.564", "849,564" o "1.234,56".
 * Devuelve null si no es un número válido (para no mostrar datos falsos).
 */
export function parseTasa(valor: unknown): number | null {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null;
  if (typeof valor !== 'string') return null;

  const t = valor.trim();
  if (!t) return null;

  let n: number;
  if (t.includes(',')) {
    // Formato venezolano: punto = miles, coma = decimales
    n = Number(t.replace(/\./g, '').replace(',', '.'));
  } else {
    const partes = t.split('.');
    // "1.234.567" → separador de miles; "849.564" → decimal
    n = partes.length > 2 ? Number(partes.join('')) : Number(t);
  }

  return Number.isFinite(n) ? n : null;
}

/** 849.564 → "849,56" (formato es-VE, siempre 2 decimales) */
export function formatTasa(n: number): string {
  return n.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
