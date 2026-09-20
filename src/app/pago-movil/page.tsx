import type { Metadata } from 'next';
import Link from 'next/link';
import PagoMovilForm from '@/components/PagoMovilForm';

export const metadata: Metadata = {
  title: 'Pago móvil · Dólar Monitor',
  description: 'Configura tu banco, teléfono y cédula para copiar el pago móvil junto al monto.',
};

export default function PagoMovilPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h1 className="font-mono text-xs tracking-widest uppercase text-zinc-500 dark:text-gray-500 mb-5">
            Configuración del pago móvil
          </h1>
          <PagoMovilForm />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-zinc-400 dark:text-gray-500 hover:text-green-500 text-sm font-mono transition-colors"
          >
            ← Volver a la calculadora
          </Link>
        </div>
      </div>
    </div>
  );
}
