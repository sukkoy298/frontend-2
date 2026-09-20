export type PagoMovil = {
  banco: string;
  telefono: string;
  cedula: string;
};

export const BANCOS: { code: string; name: string }[] = [
  { code: '0102', name: 'Banco de Venezuela' },
  { code: '0104', name: 'Venezolano de Crédito' },
  { code: '0105', name: 'Mercantil' },
  { code: '0108', name: 'BBVA Provincial' },
  { code: '0114', name: 'Bancaribe' },
  { code: '0115', name: 'Banco Exterior' },
  { code: '0128', name: 'Banco Caroní' },
  { code: '0134', name: 'Banesco' },
  { code: '0137', name: 'Sofitasa' },
  { code: '0138', name: 'Banco Plaza' },
  { code: '0146', name: 'Bangente' },
  { code: '0151', name: 'BFC Banco Fondo Común' },
  { code: '0156', name: '100% Banco' },
  { code: '0157', name: 'DelSur' },
  { code: '0163', name: 'Banco del Tesoro' },
  { code: '0166', name: 'Banco Agrícola de Venezuela' },
  { code: '0168', name: 'Bancrecer' },
  { code: '0169', name: 'Mi Banco' },
  { code: '0171', name: 'Banco Activo' },
  { code: '0172', name: 'Bancamiga' },
  { code: '0174', name: 'Banplus' },
  { code: '0175', name: 'Banco Bicentenario' },
  { code: '0177', name: 'Banfanb' },
  { code: '0191', name: 'Banco Nacional de Crédito' },
];

const KEY = 'pagomovil';

export const PAGO_VACIO: PagoMovil = { banco: '', telefono: '', cedula: '' };

export function leerPagoMovil(): PagoMovil {
  if (typeof window === 'undefined') return PAGO_VACIO;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return PAGO_VACIO;
    const parsed = JSON.parse(raw) as Partial<PagoMovil>;
    return {
      banco: parsed.banco ?? '',
      telefono: parsed.telefono ?? '',
      cedula: parsed.cedula ?? '',
    };
  } catch {
    return PAGO_VACIO;
  }
}

export function guardarPagoMovil(data: PagoMovil) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

export function estaCompleto(p: PagoMovil): boolean {
  return Boolean(p.banco && p.telefono.trim() && p.cedula.trim());
}

/** Etiqueta del banco con su código: "Banesco (0134)" */
export function bancoLabel(buscar: string): string {
  const b = BANCOS.find((x) => x.name === buscar || x.code === buscar);
  return b ? `${b.name} (${b.code})` : buscar;
}

/** "04141234567" → "0414-1234567" (si no calza, se deja igual) */
export function formatoTelefono(t: string): string {
  const d = t.replace(/\D/g, '');
  if (d.length === 11) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return t;
}

/** Monto con formato venezolano. Acepta "1234.56" o "1.234,56" y devuelve "1.234,56" */
export function formatoMontoBs(monto: string): string {
  const t = (monto ?? '').trim();
  if (!t) return '';

  let n: number;
  if (t.includes(',')) {
    // Ya viene en formato VE: punto = miles, coma = decimales
    n = Number(t.replace(/\./g, '').replace(',', '.'));
  } else {
    const partes = t.split('.');
    // "1.234.567" → miles; "1234.56" → decimal
    n = partes.length > 2 ? Number(partes.join('')) : Number(t);
  }

  if (!Number.isFinite(n)) return monto;
  return n.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Texto que se copia al portapapeles */
export function textoPagoMovil(p: PagoMovil, montoBs: string): string {
  const lineas = [
    'Pago móvil',
    `Banco: ${bancoLabel(p.banco)}`,
    `Teléfono: ${formatoTelefono(p.telefono)}`,
    `Cédula: ${p.cedula}`,
  ];
  if (montoBs) lineas.push(`Monto: Bs. ${formatoMontoBs(montoBs)}`);
  return lineas.join('\n');
}
