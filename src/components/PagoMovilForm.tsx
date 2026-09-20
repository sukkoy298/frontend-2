'use client';

import { useEffect, useState } from 'react';
import {
  BANCOS,
  PAGO_VACIO,
  type PagoMovil,
  estaCompleto,
  guardarPagoMovil,
  leerPagoMovil,
} from '@/lib/pagoMovil';

export default function PagoMovilForm({ onGuardado }: { onGuardado?: () => void }) {
  const [data, setData] = useState<PagoMovil>(PAGO_VACIO);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    setData(leerPagoMovil());
  }, []);

  const guardar = () => {
    guardarPagoMovil(data);
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
      onGuardado?.();
    }, 900);
  };

  const limpiar = () => {
    const vacio = { ...PAGO_VACIO };
    setData(vacio);
    guardarPagoMovil(vacio);
  };

  const campo =
    'w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 px-4 text-base text-zinc-900 dark:text-white font-mono outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all';
  const label =
    'block text-zinc-500 dark:text-gray-500 text-[11px] uppercase tracking-widest mb-2 font-mono';

  return (
    <div>
      <p className="text-zinc-500 dark:text-gray-500 text-xs mb-5 leading-relaxed">
        Estos datos se guardan en este navegador y se copian junto al monto en bolívares
        cuando tocas el botón de copiar.
      </p>

      <div className="mb-4">
        <label className={label}>Banco</label>
        <select
          value={data.banco}
          onChange={(e) => setData({ ...data, banco: e.target.value })}
          className={campo}
        >
          <option value="">Selecciona un banco…</option>
          {BANCOS.map((b) => (
            <option key={b.code} value={b.name}>
              {b.name} ({b.code})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className={label}>Teléfono</label>
        <input
          type="tel"
          inputMode="numeric"
          value={data.telefono}
          onChange={(e) => setData({ ...data, telefono: e.target.value })}
          placeholder="04141234567"
          className={campo}
        />
      </div>

      <div className="mb-5">
        <label className={label}>Cédula</label>
        <input
          type="text"
          value={data.cedula}
          onChange={(e) => setData({ ...data, cedula: e.target.value })}
          placeholder="V-12345678"
          className={campo}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={guardar}
          disabled={!estaCompleto(data)}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-mono text-white transition-colors cursor-pointer"
        >
          {guardado ? '✓ Guardado' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={limpiar}
          className="px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-mono text-zinc-500 dark:text-gray-500 hover:border-red-500/50 hover:text-red-500 transition-all cursor-pointer"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
