'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Calculator, Receipt, Smartphone, ChevronRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import PagoMovilForm from './PagoMovilForm';
import { estaCompleto, leerPagoMovil } from '@/lib/pagoMovil';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pagoAbierto, setPagoAbierto] = useState(false);
  const [configurado, setConfigurado] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setConfigurado(estaCompleto(leerPagoMovil()));
  }, [pagoAbierto]);

  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  useEffect(() => {
    const abierto = menuAbierto || pagoAbierto;
    document.body.style.overflow = abierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuAbierto, pagoAbierto]);

  const item =
    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-colors';
  const activo = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white';
  const inactivo =
    'text-zinc-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60';

  return (
    <div className="min-h-screen bg-background">
      {/* ── Barra superior ── */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-3 h-14 flex items-center justify-between">
          <button
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            className="p-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="font-mono text-[11px] tracking-widest uppercase text-zinc-500 dark:text-gray-500">
            Dólar Monitor
          </span>

          <ThemeToggle />
        </div>
      </header>

      {/* ── Contenido ── */}
      <main className="pt-14">{children}</main>

      {/* ── Menú lateral ── */}
      {menuAbierto && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuAbierto(false)}
          />
          <aside className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-background border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="font-mono text-xs tracking-widest uppercase text-zinc-500 dark:text-gray-500">
                Menú
              </span>
              <button
                onClick={() => setMenuAbierto(false)}
                aria-label="Cerrar menú"
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className={`${item} ${pathname === '/' ? activo : inactivo}`}
              >
                <Calculator className="w-4 h-4 shrink-0" />
                Calculadora
                {pathname === '/' && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>

              <Link
                href="/calculadora"
                className={`${item} ${
                  pathname === '/calculadora' ? activo : inactivo
                }`}
              >
                <Receipt className="w-4 h-4 shrink-0" />
                Calculadora completa
                {pathname === '/calculadora' && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                )}
              </Link>

              <button
                onClick={() => {
                  setMenuAbierto(false);
                  setPagoAbierto(true);
                }}
                className={`${item} ${inactivo} w-full text-left cursor-pointer`}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                Pago móvil
                <span
                  className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    configurado ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  title={configurado ? 'Configurado' : 'Sin configurar'}
                />
              </button>
            </nav>

            <p className="mt-auto px-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 leading-relaxed">
              Los datos del pago móvil se guardan solo en este navegador.
            </p>
          </aside>
        </div>
      )}

      {/* ── Panel de configuración de pago móvil ── */}
      {pagoAbierto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPagoAbierto(false)}
          />
          <div className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-background border border-zinc-200 dark:border-zinc-800 sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-mono text-xs tracking-widest uppercase text-zinc-500 dark:text-gray-500">
                Configuración del pago móvil
              </h2>
              <button
                onClick={() => setPagoAbierto(false)}
                aria-label="Cerrar"
                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <PagoMovilForm onGuardado={() => setPagoAbierto(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
