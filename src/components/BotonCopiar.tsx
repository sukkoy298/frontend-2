'use client';

import { useState } from 'react';
import { estaCompleto, leerPagoMovil, textoPagoMovil } from '@/lib/pagoMovil';
import { copiarTexto } from '@/lib/clipboard';

type Estado = 'idle' | 'ok' | 'error' | 'vacio';

export default function BotonCopiar({
  montoBs,
  etiqueta,
}: {
  montoBs: string;
  etiqueta?: boolean;
}) {
  const [estado, setEstado] = useState<Estado>('idle');

  const copiar = async () => {
    const p = leerPagoMovil();
    if (!estaCompleto(p)) {
      setEstado('vacio');
      setTimeout(() => setEstado('idle'), 3000);
      return;
    }

    const texto = textoPagoMovil(p, montoBs);
    const ok = await copiarTexto(texto);
    if (ok) {
      setEstado('ok');
      setTimeout(() => setEstado('idle'), 1800);
    } else {
      setEstado('error');
      setTimeout(() => setEstado('idle'), 3000);
    }
  };

  const titulo =
    estado === 'ok'
      ? '¡Copiado!'
      : estado === 'vacio'
        ? 'Configura tu pago móvil abajo'
        : estado === 'error'
          ? 'No se pudo copiar'
          : 'Copiar pago móvil + monto';

  const color =
    estado === 'ok'
      ? 'text-green-600 dark:text-green-500 border-green-500/50'
      : estado === 'vacio' || estado === 'error'
        ? 'text-amber-600 dark:text-amber-400 border-amber-500/50'
        : 'text-zinc-400 dark:text-gray-500 border-zinc-200 dark:border-zinc-800 hover:border-green-500 hover:text-green-600 dark:hover:text-green-500';

  return (
    <button
      type="button"
      onClick={copiar}
      title={titulo}
      aria-label={titulo}
      className={`inline-flex items-center gap-1.5 rounded-md border bg-transparent transition-all cursor-pointer ${
        etiqueta ? 'px-2.5 py-1' : 'px-2 py-1'
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
      {etiqueta && <span className="text-[11px] font-mono">copiar</span>}
    </button>
  );
}
