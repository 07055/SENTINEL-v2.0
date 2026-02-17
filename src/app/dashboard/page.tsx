'use client';

import { useEffect, useState } from 'react';
import { TradingChart } from '@/components/TradingChart';
import { fetchMarketData, PriceData } from '@/lib/dataService';
import { fetchStockData, StockData } from '@/lib/stockService';
import { generatePrediction, PredictionResult } from '@/lib/predictionEngine';
import { CandlestickData, LineData } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Activity, ShieldCheck, Zap, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskDisclaimer from '@/components/RiskDisclaimer';
import AssetToggler from '@/components/AssetToggler';
import SearchComponent from '@/components/SearchComponent';

export default function Dashboard() {
  const [mode, setMode] = useState<'CRYPTO' | 'STOCKS'>('CRYPTO');
  const [data, setData] = useState<PriceData[] | StockData[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('BTCUSDT');

  // New Search Handler
  const handleSearch = async () => {
    setLoading(true);
    setPrediction(null); // Reset prediction on new search

    try {
      if (mode === 'CRYPTO') {
        const history = await fetchMarketData(symbol, '1d', 150);
        setData(history);
      } else {
        const history = await fetchStockData(symbol);
        setData(history);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load & Mode Switch
  useEffect(() => {
    const defaultSymbol = mode === 'CRYPTO' ? 'BTCUSDT' : 'IBM';
    setSymbol(defaultSymbol);

    // Auto-trigger search when mode changes
    const init = async () => {
      setLoading(true);
      setPrediction(null);
      if (mode === 'CRYPTO') {
        const history = await fetchMarketData(defaultSymbol, '1d', 150);
        setData(history);
      } else {
        const history = await fetchStockData(defaultSymbol);
        setData(history);
      }
      setLoading(false);
    };
    init();
  }, [mode]);

  const handlePredict = async () => {
    if (data.length > 0) {
      let result;

      if (mode === 'CRYPTO') {
        // Fetch 4h data for Pro Analysis
        const data4h = await fetchMarketData(symbol, '4h', 100);
        result = generatePrediction(data as PriceData[], data4h);
      } else {
        result = generatePrediction(data as PriceData[]);
      }

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

  return (
    <main className="min-h-screen p-6 lg:p-12 space-y-8 bg-[#030712]">
      <RiskDisclaimer />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="text-cyber-blue" size={32} />
            SENTINEL <span className="text-cyber-blue">v3.0</span>
          </h1>
          <p className="text-gray-400 font-mono flex items-center gap-2">
            <Globe size={14} className="text-cyber-blue" />
            {mode === 'CRYPTO' ? 'LIVE BINANCE CONNECTION' : 'ALPHA VANTAGE STOCK FEED'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <AssetToggler mode={mode} setMode={setMode} />

          <SearchComponent
            symbol={symbol}
            setSymbol={setSymbol}
            mode={mode}
            onSearch={handleSearch}
          />

          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse" />
            <span className="text-sm font-mono text-cyber-neon uppercase tracking-widest">Active</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Market Stats */}
        <div className="space-y-4">
          {/* Dynamic Stats based on data */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-2xl border-l-4 border-l-cyber-blue"
          >
            <div className="flex justify-between items-start mb-4">
              <Activity className="text-cyber-blue" size={24} />
              <span className="text-xs font-mono text-gray-500 uppercase">{symbol}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${data[data.length - 1]?.close.toLocaleString() || '---'}
            </p>
            <div className="text-sm text-gray-500 font-mono mt-1">Current Price</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl border-l-4 border-l-yellow-400"
          >
            <div className="flex justify-between items-start mb-4">
              <Zap className="text-yellow-400" size={24} />
              <span className="text-xs font-mono text-gray-500 uppercase">RSI (14)</span>
            </div>
            <p className="text-2xl font-bold text-white">{prediction?.rsiValue || '---'}</p>
            <div className="text-sm text-gray-500 font-mono mt-1">Momentum</div>
          </motion.div>

          <button
            onClick={handlePredict}
            disabled={loading || data.length === 0}
            className="w-full py-4 rounded-2xl bg-cyber-blue text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Activity className="animate-spin" /> : <TrendingUp size={20} />}
            {loading ? 'ANALYZING...' : 'RUN PRO ANALYSIS'}
          </button>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-2 rounded-3xl relative min-h-[400px]">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl">
                <div className="text-cyber-blue flex flex-col items-center">
                  <Activity className="animate-spin mb-2" size={32} />
                  <span className="font-mono text-xs tracking-widest">FETCHING DATA STREAM...</span>
                </div>
              </div>
            )}
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
                  <h3 className="text-gray-400 font-mono text-xs mb-2 uppercase">Pro Analysis</h3>

                  {/* Signals List */}
                  <div className="space-y-1 mb-2">
                    {/* @ts-ignore */}
                    {prediction.signals?.map((sig, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                        <div className="w-1 h-1 bg-cyber-blue rounded-full" />
                        {sig}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">Multi-Timeframe Logic Active</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
