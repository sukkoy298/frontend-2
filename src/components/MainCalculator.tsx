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
    </div>
  );
}
