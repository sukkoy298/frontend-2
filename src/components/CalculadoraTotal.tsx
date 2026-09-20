'use client';

import { useState, useEffect, useCallback } from 'react';
import BotonCopiar from './BotonCopiar';

type PriceData = {
  usdt: number | null;
  bcv: number | null;
  euro: number | null;
};

type ActiveField = 'usdt' | 'bs' | 'usd' | 'eur';

export default function CalculadoraTotal() {
  const [prices, setPrices] = useState<PriceData>({ usdt: null, bcv: null, euro: null });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState({ usdt: '', bs: '', usd: '', eur: '' });

  const fetchAllPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usdtRes, bcvRes, euroRes] = await Promise.all([
        fetch('/api/dolarUsdt'),
        fetch('/api/dolarBcv'),
        fetch('/api/euroBcv'),
      ]);
      const usdtData = await usdtRes.json();
      const bcvData = await bcvRes.json();
      const euroData = await euroRes.json();

      if (!usdtData.price || !bcvData.price || !euroData.price) {
        throw new Error('No se pudieron obtener todos los precios');
      }

      setPrices({
        usdt: parseFloat(usdtData.price),
        bcv: parseFloat(bcvData.price),
        euro: parseFloat(euroData.price),
      });
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al obtener precios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPrices();
  }, [fetchAllPrices]);

  const handleInput = (field: ActiveField, raw: string) => {
    // Sanitize input: only digits and one decimal point
    let value = raw.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    const num = parseFloat(value);
    if (isNaN(num) || !value) {
      setValues({ usdt: '', bs: '', usd: '', eur: '' });
      return;
    }

    const { usdt: up, bcv: bp, euro: ep } = prices;
    if (!up || !bp || !ep) return;

    let newValues = { usdt: '', bs: '', usd: '', eur: '' };

    switch (field) {
      case 'usdt': {
        const bs = num * up;
        newValues = {
          usdt: value,
          bs: bs.toFixed(2),
          usd: (bs / bp).toFixed(2),
          eur: (bs / ep).toFixed(2),
        };
        break;
      }
      case 'bs': {
        newValues = {
          usdt: (num / up).toFixed(2),
          bs: value,
          usd: (num / bp).toFixed(2),
          eur: (num / ep).toFixed(2),
        };
        break;
      }
      case 'usd': {
        const bs = num * bp;
        newValues = {
          usdt: (bs / up).toFixed(2),
          bs: bs.toFixed(2),
          usd: value,
          eur: (bs / ep).toFixed(2),
        };
        break;
      }
      case 'eur': {
        const bs = num * ep;
        newValues = {
          usdt: (bs / up).toFixed(2),
          bs: bs.toFixed(2),
          usd: (bs / bp).toFixed(2),
          eur: value,
        };
        break;
      }
    }

    setValues(newValues);
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      {/* Precios en vivo */}
      <div className="text-center mb-8">
        <h1 className="font-mono text-sm tracking-widest text-zinc-400 dark:text-gray-500 uppercase mb-1">
          Calculadora de Tasas
        </h1>
        <p className="text-zinc-400 dark:text-gray-500 text-xs font-mono">Convierte entre USDT, BS, USD y EUR</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* USDT Price Card */}
        <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center relative overflow-hidden shadow-sm ${loading ? 'opacity-50' : ''}`}>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
          <p className="text-zinc-400 dark:text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-mono">USDT</p>
          <p className="font-mono text-lg font-bold text-yellow-600 dark:text-yellow-500 leading-none">
            {loading ? '...' : formatPrice(prices.usdt || 0)}
          </p>
          <p className="text-zinc-400 dark:text-gray-500 text-[9px] font-mono mt-1">Bs</p>
        </div>

        {/* BCV Price Card */}
        <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center relative overflow-hidden shadow-sm ${loading ? 'opacity-50' : ''}`}>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent" />
          <p className="text-zinc-400 dark:text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-mono">USD BCV</p>
          <p className="font-mono text-lg font-bold text-green-600 dark:text-green-500 leading-none">
            {loading ? '...' : formatPrice(prices.bcv || 0)}
          </p>
          <p className="text-zinc-400 dark:text-gray-500 text-[9px] font-mono mt-1">Bs</p>
        </div>

        {/* EUR Price Card */}
        <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center relative overflow-hidden shadow-sm ${loading ? 'opacity-50' : ''}`}>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <p className="text-zinc-400 dark:text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-mono">EUR BCV</p>
          <p className="font-mono text-lg font-bold text-blue-600 dark:text-blue-500 leading-none">
            {loading ? '...' : formatPrice(prices.euro || 0)}
          </p>
          <p className="text-zinc-400 dark:text-gray-500 text-[9px] font-mono mt-1">Bs</p>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <p className="text-zinc-400 dark:text-gray-500 text-xs uppercase tracking-widest mb-5 font-mono">
          Convertir
        </p>

        {/* USDT Input */}
        <div className="mb-3">
          <label className="block text-zinc-500 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-1.5 font-mono">
            USDT (Binance)
          </label>
          <div className="relative">
            <input
              type="text"
              value={values.usdt}
              onChange={(e) => handleInput('usdt', e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 px-4 text-base text-zinc-900 dark:text-white font-mono outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition-all"
            />
            <span className="absolute right-3 text-yellow-600 dark:text-yellow-500 font-mono text-xs top-1/2 -translate-y-1/2">USDT</span>
          </div>
        </div>

        {/* BS Input */}
        <div className="mb-3">
          <label className="block text-zinc-500 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-1.5 font-mono">
            Bolívares
          </label>
          <div className="relative">
            <input
              type="text"
              value={values.bs}
              onChange={(e) => handleInput('bs', e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 px-4 pr-24 text-base text-zinc-900 dark:text-white font-mono outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <BotonCopiar montoBs={values.bs} />
              <span className="text-violet-500 font-mono text-xs">BS</span>
            </div>
          </div>
        </div>

        {/* USD Input */}
        <div className="mb-3">
          <label className="block text-zinc-500 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-1.5 font-mono">
            Dólar (BCV)
          </label>
          <div className="relative">
            <input
              type="text"
              value={values.usd}
              onChange={(e) => handleInput('usd', e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 px-4 text-base text-zinc-900 dark:text-white font-mono outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all"
            />
            <span className="absolute right-3 text-green-600 dark:text-green-500 font-mono text-xs top-1/2 -translate-y-1/2">USD</span>
          </div>
        </div>

        {/* EUR Input */}
        <div className="mb-3">
          <label className="block text-zinc-500 dark:text-gray-500 text-[10px] uppercase tracking-wide mb-1.5 font-mono">
            Euro (BCV)
          </label>
          <div className="relative">
            <input
              type="text"
              value={values.eur}
              onChange={(e) => handleInput('eur', e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 px-4 text-base text-zinc-900 dark:text-white font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
            <span className="absolute right-3 text-blue-600 dark:text-blue-500 font-mono text-xs top-1/2 -translate-y-1/2">EUR</span>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchAllPrices}
          disabled={loading}
          className="w-full mt-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-gray-400 text-sm font-mono flex items-center justify-center gap-2 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-500 transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          {loading ? 'Actualizando...' : 'Actualizar precios'}
        </button>
        {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}
      </div>

      {lastUpdate && (
        <p className="text-zinc-400 dark:text-gray-500 text-[10px] mt-4 text-center font-mono">
          Precios actualizados: {lastUpdate.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-center gap-4">
        <a href="/" className="text-zinc-400 dark:text-gray-500 hover:text-green-500 text-sm font-mono transition-colors">
          ← Principal
        </a>
      </div>
    </div>
  );
}
