'use client';

import { Search } from 'lucide-react';

interface SearchComponentProps {
    symbol: string;
    setSymbol: (s: string) => void;
    mode: 'CRYPTO' | 'STOCKS';
    onSearch: () => void;
}

export default function SearchComponent({ symbol, setSymbol, mode, onSearch }: SearchComponentProps) {
    return (
        <div className="glass-panel px-2 py-2 rounded-xl flex items-center gap-2 border border-blue-500/30 w-full md:w-64">
            <Search className="text-gray-500 ml-2" size={18} />
            <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder={mode === 'CRYPTO' ? 'Sym: BTCUSDT' : 'Ticker: IBM'}
                className="bg-transparent border-none focus:outline-none text-white font-mono text-sm w-full placeholder-gray-600"
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            <button
                onClick={onSearch}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-cyber-blue transition-colors"
            >
                GO
            </button>
        </div>
    );
}
