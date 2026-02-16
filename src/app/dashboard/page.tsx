'use client';

import { useEffect, useState } from 'react';
import { TradingChart } from '@/components/TradingChart';
import { fetchMarketData, PriceData } from '@/lib/dataService';
import { generatePrediction, PredictionResult } from '@/lib/predictionEngine';
import { CandlestickData, LineData } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Activity, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskDisclaimer from '@/components/RiskDisclaimer';

export default function Dashboard() {
  const [data, setData] = useState<PriceData[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('BTCUSDT');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const history = await fetchMarketData(symbol, '1d', 150);
      setData(history);
      setLoading(false);
    };
    init();
  }, [symbol]);

  const handlePredict = () => {
    if (data.length > 0) {
      const result = generatePrediction(data);
      setPrediction(result);
    }
  };

  const chartData: CandlestickData[] = data.map((d) => ({
    time: d.time as any,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));

  const predictionLines: LineData[] | undefined = prediction?.predictedData.map((p) => ({
    time: p.time as any,
    value: p.value,
  }));

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#030712]">
        <div className="text-cyber-blue animate-pulse flex flex-col items-center">
          <Activity size={48} className="mb-4" />
          <p className="text-xl font-mono">FETCHING BINANCE STREAM...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 lg:p-12 space-y-8 bg-[#030712]">
      <RiskDisclaimer />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="text-cyber-blue" size={32} />
            SENTINEL <span className="text-cyber-blue">v2.0</span>
          </h1>
          <p className="text-gray-400 font-mono flex items-center gap-2">
            <Globe size={14} className="text-cyber-blue" />
            LIVE BINANCE MAINNET CONNECTION
          </p>
        </div>
        <div className="flex gap-4">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="glass-panel px-4 py-2 rounded-lg bg-transparent text-white border-blue-500/30 focus:outline-none font-mono"
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
          </select>
          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse" />
            <span className="text-sm font-mono text-cyber-neon uppercase tracking-widest">Market Open</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Market Stats */}
        <div className="space-y-4">
          {[
            { label: symbol, value: '$' + data[data.length - 1]?.close.toLocaleString(), change: '+', icon: Activity, color: 'text-cyber-blue' },
            { label: 'RSI (14)', value: prediction?.rsiValue || '52', change: 'Neutral', icon: Zap, color: 'text-yellow-400' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="glass-panel p-6 rounded-2xl border-l-4 border-l-cyber-blue"
            >
              <div className="flex justify-between items-start mb-4">
                <stat.icon className={stat.color} size={24} />
                <span className="text-xs font-mono text-gray-500 uppercase">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <div className="text-sm text-gray-500 font-mono mt-1">{stat.change}</div>
            </motion.div>
          ))}

          <button
            onClick={handlePredict}
            className="w-full py-4 rounded-2xl bg-cyber-blue text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} />
            RUN QUANT PREDICTION
          </button>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-2 rounded-3xl">
            <TradingChart data={chartData} predictionData={predictionLines} />
          </div>

          {/* Prediction Panel Overlay */}
          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="glass-panel p-6 rounded-2xl col-span-2 flex items-center justify-between border-l-4 border-l-cyber-neon">
                  <div>
                    <h3 className="text-gray-400 font-mono text-xs mb-2 uppercase tracking-widest">AI Consensus Signal</h3>
                    <div className="flex items-center gap-4">
                      <span className={`text-4xl font-black ${prediction.signal === 'BUY' ? 'text-cyber-neon' : prediction.signal === 'SELL' ? 'text-cyber-red' : 'text-gray-400'}`}>
                        {prediction.signal} ORDER
                      </span>
                      {prediction.signal === 'BUY' && <TrendingUp className="text-cyber-neon" size={32} />}
                      {prediction.signal === 'SELL' && <TrendingDown className="text-cyber-red" size={32} />}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-mono text-xs uppercase mb-1">Confidence Score</p>
                    <p className="text-3xl font-bold text-white tracking-tighter">{prediction.confidence}%</p>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-blue-500/30">
                  <h3 className="text-gray-400 font-mono text-xs mb-2 uppercase">Analysis Type</h3>
                  <p className="text-2xl font-bold text-white uppercase font-mono">RSI + EMA</p>
                  <p className="text-sm text-gray-500 mt-2">Projection based on Alpha-Convergence v2</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="pt-8 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-xs font-mono max-w-2xl mx-auto">
          DISCLAIMER: SENTINEL IS AN ALGORITHMIC ANALYSIS TOOL. TRADING INVOLVES SIGNIFICANT RISK.
          PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS.
        </p>
      </footer>
    </main>
  );
}
