'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, BarChart3, Globe, ArrowRight, Shield, Cpu, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-cyber-blue text-sm font-mono mb-8"
                >
                    <Zap size={16} />
                    <span>V2.0 LIVE ON MAINNET</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
                >
                    TRADE WITH <br />
                    <span className="text-cyber-blue">QUANTUM SPEED</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light"
                >
                    SENTINEL is an enterprise-grade algorithmic analysis platform that predicts market movements using RSI-Convergence and real-time Binance data.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <Link href="/dashboard" className="w-full md:w-auto px-8 py-4 bg-cyber-blue rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        LAUNCH CONSOLE <ArrowRight size={20} />
                    </Link>
                    <button className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md">
                        VIEW DOCUMENTATION
                    </button>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="relative py-20 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Proprietary AI Engine",
                            desc: "Alpha-Convergence v2 logic combines 14-period RSI with EMA crossovers for 85%+ signal confidence.",
                            icon: Cpu
                        },
                        {
                            title: "Binance Mainnet Data",
                            desc: "Latency-free data streaming directly from the global liquidity giant. No lag, no slippage.",
                            icon: Globe
                        },
                        {
                            title: "Military-Grade UI",
                            desc: "Optimized dark-mode console designed for reduced eye strain during 12-hour high-volatility shifts.",
                            icon: Shield
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-8 rounded-3xl border-white/5 hover:border-blue-500/30 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-cyber-blue group-hover:scale-110 transition-transform">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-400 font-light leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Trust Banner */}
            <section className="py-20 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-4">
                        <Lock className="text-cyber-neon" size={40} />
                        <div>
                            <h4 className="text-xl font-bold uppercase tracking-widest">Self-Custodial Core</h4>
                            <p className="text-gray-500 font-mono text-sm uppercase">No API Keys stored on server. Your data, your rules.</p>
                        </div>
                    </div>
                    <div className="flex gap-8 opacity-40">
                        <ShieldCheck size={48} />
                        <Zap size={48} />
                        <BarChart3 size={48} />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-gray-600 font-mono text-xs uppercase tracking-[0.2em]">
                © 2026 SENTINEL QUANTUM — ALL RIGHTS RESERVED
            </footer>
        </div>
    );
}
