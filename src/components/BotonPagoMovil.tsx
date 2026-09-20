'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone } from 'lucide-react';
import { estaCompleto, leerPagoMovil, textoPagoMovil } from '@/lib/pagoMovil';
import { copiarTexto } from '@/lib/clipboard';

type Estado = 'idle' | 'ok' | 'error';

/**
 * Copia los datos del pago móvil junto al monto en bolívares.
 * Si el pago móvil no está configurado, lleva a la página de configuración.
 */
export default function BotonPagoMovil({ montoBs }: { montoBs: string }) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>('idle');

  const copiar = async () => {
    const p = leerPagoMovil();
    if (!estaCompleto(p)) {
      router.push('/pago-movil');
      return;
    }

    const ok = await copiarTexto(textoPagoMovil(p, montoBs));
    setEstado(ok ? 'ok' : 'error');
    setTimeout(() => setEstado('idle'), ok ? 1800 : 3000);
  };

  const titulo =
    estado === 'ok'
      ? '¡Copiado!'
      : estado === 'error'
        ? 'No se pudo copiar'
        : 'Copiar pago móvil con el monto en Bs';

  const color =
    estado === 'ok'
      ? 'text-green-600 dark:text-green-500 border-green-500/50'
      : estado === 'error'
        ? 'text-amber-600 dark:text-amber-400 border-amber-500/50'
        : 'text-zinc-500 dark:text-gray-400 border-zinc-200 dark:border-zinc-800 hover:border-green-500 hover:text-green-600 dark:hover:text-green-500';

  return (
    <button
      type="button"
      onClick={copiar}
      title={titulo}
      aria-label={titulo}
      className={`w-full mt-1 py-3 bg-transparent border rounded-lg text-sm font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${color}`}
    >
      {estado === 'ok' ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <Smartphone className="w-4 h-4" />
      )}
      {estado === 'ok' ? 'Copiado' : 'Copiar pago móvil'}
    </button>
  );
}
