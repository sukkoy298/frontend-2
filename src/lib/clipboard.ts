/**
 * Copiar al portapapeles con respaldo para contextos NO seguros.
 *
 * `navigator.clipboard` solo existe en contextos seguros (HTTPS o localhost).
 * Al entrar por IP de red local en HTTP (ej. http://192.168.101.98:3010),
 * el navegador lo bloquea y la copia falla en silencio.
 * El respaldo usa un <textarea> temporal + document.execCommand('copy'),
 * que sigue funcionando en HTTP.
 */
export async function copiarTexto(texto: string): Promise<boolean> {
  // 1) Camino moderno — requiere contexto seguro
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof window !== 'undefined' &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      // cae al respaldo
    }
  }

  // 2) Respaldo clásico — funciona en HTTP por IP
  try {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.width = '1px';
    ta.style.height = '1px';
    ta.style.padding = '0';
    ta.style.border = 'none';
    ta.style.outline = 'none';
    ta.style.boxShadow = 'none';
    ta.style.background = 'transparent';
    ta.style.opacity = '0';

    document.body.appendChild(ta);

    // iOS necesita setSelectionRange tras select()
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, texto.length);

    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** ¿Se puede copiar automáticamente en este contexto? */
export function copiadoAutomaticoDisponible(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.isSecureContext && navigator.clipboard) return true;
  // el respaldo con execCommand sigue disponible en HTTP
  return typeof document !== 'undefined' && 'execCommand' in document;
}
