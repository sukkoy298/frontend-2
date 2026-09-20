'use client';

import { useState } from 'react';
import { formatoMontoBs } from '@/lib/pagoMovil';
import { copiarTexto } from '@/lib/clipboard';

type Estado = 'idle' | 'ok' | 'error';

/**
 * Botón que está pegado al campo del monto: copia ÚNICAMENTE el monto en Bs.
 * Para copiar los datos del pago móvil está BotonPagoMovil.
 */
export default function BotonCopiar({ montoBs }: { montoBs: string }) {
  const [estado, setEstado] = useState<Estado>('idle');
  const texto = formatoMontoBs(montoBs);
  const vacio = texto === '';

  const copiar = async () => {
    if (vacio) return;
    const ok = await copiarTexto(texto);
    setEstado(ok ? 'ok' : 'error');
    setTimeout(() => setEstado('idle'), ok ? 1800 : 3000);
  };

  const titulo =
    estado === 'ok'
      ? '¡Copiado!'
      : estado === 'error'
        ? 'No se pudo copiar'
        : vacio
          ? 'Escribe un monto para copiarlo'
          : 'Copiar monto en bolívares';

  const color =
    estado === 'ok'
      ? 'text-green-600 dark:text-green-500 border-green-500/50'
      : estado === 'error'
        ? 'text-amber-600 dark:text-amber-400 border-amber-500/50'
        : 'text-zinc-400 dark:text-gray-500 border-zinc-200 dark:border-zinc-800 hover:border-green-500 hover:text-green-600 dark:hover:text-green-500';

  return (
    <button
      type="button"
      onClick={copiar}
      disabled={vacio}
      title={titulo}
      aria-label={titulo}
      className={`inline-flex items-center gap-1.5 rounded-md border bg-transparent px-2 py-1 transition-all ${
        vacio ? 'cursor-default opacity-40' : 'cursor-pointer'
      } ${color}`}
    >
      {estado === 'ok' ? (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}
