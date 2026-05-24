'use client';

import { useState } from 'react';
import CalculadoraDolar from './CalculadoraDolar';
import CalculadoraUsdt from './CalculadoraUsdt';
import CalculadoraEuro from './CalculadoraEuro';

export default function MainCalculator({ initialTab = 'bcv' }: { initialTab?: 'bcv' | 'usdt' | 'euro' }) {
  const [activeTab, setActiveTab] = useState<'bcv' | 'usdt' | 'euro'>(initialTab);

  return (
    <div className="w-full max-w-md">
      <div className="flex p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-6 relative shadow-sm">
        <button
          onClick={() => setActiveTab('bcv')}
          className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-all rounded-lg z-10 ${
            activeTab === 'bcv'
              ? 'text-zinc-900 dark:text-white'
              : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          DÓLAR BCV
        </button>
        <button
          onClick={() => setActiveTab('euro')}
          className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-all rounded-lg z-10 ${
            activeTab === 'euro'
              ? 'text-zinc-900 dark:text-white'
              : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          EURO BCV
        </button>
        <button
          onClick={() => setActiveTab('usdt')}
          className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-all rounded-lg z-10 ${
            activeTab === 'usdt'
              ? 'text-zinc-900 dark:text-white'
              : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          DÓLAR USDT
        </button>
        
        {/* Active Indicator Slider */}
        <div 
          className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md"
          style={{
            width: 'calc(33.333% - 2.66px)',
            left: '4px',
            transform: `translateX(${activeTab === 'bcv' ? '0' : activeTab === 'euro' ? '100%' : '200%'})`
          }}
        >
          <div className={`absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent ${activeTab === 'bcv' ? 'via-green-500' : activeTab === 'euro' ? 'via-blue-500' : 'via-yellow-500'} to-transparent`} />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'bcv' && <CalculadoraDolar hideTitle hideLink />}
        {activeTab === 'euro' && <CalculadoraEuro hideTitle hideLink />}
        {activeTab === 'usdt' && <CalculadoraUsdt hideTitle hideLink />}
      </div>

      <div className="mt-8 text-center">
        <a
          href="/calculadora"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-gray-500 text-sm font-mono hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-500 transition-all group shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
          CALCULADORA COMPLETA
          <span className="text-purple-500 group-hover:translate-x-0.5 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}
