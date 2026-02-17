'use client';

import { motion } from 'framer-motion';
import { Bitcoin, BarChart3 } from 'lucide-react';

interface AssetTogglerProps {
    mode: 'CRYPTO' | 'STOCKS';
    setMode: (mode: 'CRYPTO' | 'STOCKS') => void;
}

export default function AssetToggler({ mode, setMode }: AssetTogglerProps) {
    return (
        <div className="flex bg-[#0f172a] p-1 rounded-xl border border-blue-500/20 w-fit">
            <button
                onClick={() => setMode('CRYPTO')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'CRYPTO' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
            >
                {mode === 'CRYPTO' && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-blue-600 rounded-lg"
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                )}
                <span className="relative z-10 flex items-center gap-2">
                    <Bitcoin size={16} /> CRYPTO
                </span>
            </button>

            <button
                onClick={() => setMode('STOCKS')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'STOCKS' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
            >
                {mode === 'STOCKS' && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-purple-600 rounded-lg"
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                )}
                <span className="relative z-10 flex items-center gap-2">
                    <BarChart3 size={16} /> STOCKS
                </span>
            </button>
        </div>
    );
}
