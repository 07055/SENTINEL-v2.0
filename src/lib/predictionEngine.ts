import { PriceData } from './dataService';

export interface PredictionResult {
    predictedData: { time: number; value: number }[];
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    rsiValue: number;
}

// Simple Moving Average
export const calculateSMA = (data: number[], period: number): number[] => {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
    }
    return sma;
};

// Exponential Moving Average
export const calculateEMA = (data: number[], period: number): number[] => {
    const k = 2 / (period + 1);
    const ema: number[] = [data[0]];
    for (let i = 1; i < data.length; i++) {
        ema.push(data[i] * k + ema[i - 1] * (1 - k));
    }
    return ema;
};

// Relative Strength Index
export const calculateRSI = (data: number[], period: number = 14): number => {
    if (data.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = data.length - period; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
};

export const generatePrediction = (data: PriceData[]): PredictionResult => {
    const closes = data.map((d) => d.close);
    const ema20 = calculateEMA(closes, 20);
    const rsi = calculateRSI(closes, 14);

    const lastPrice = closes[closes.length - 1];
    const lastEMA = ema20[ema20.length - 1];

    // Advanced logic using RSI and EMA
    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 50;

    if (lastPrice > lastEMA && rsi < 70) {
        signal = 'BUY';
        confidence = rsi < 30 ? 85 : 70; // High confidence if oversold
    } else if (lastPrice < lastEMA && rsi > 30) {
        signal = 'SELL';
        confidence = rsi > 70 ? 85 : 70; // High confidence if overbought
    }

    const predictedData = [];
    const lastTime = data[data.length - 1].time;

    // Predict next 7 days based on EMA trend
    const trend = (lastPrice - ema20[ema20.length - 5]) / 5;

    for (let i = 1; i <= 7; i++) {
        predictedData.push({
            time: lastTime + i * 24 * 60 * 60,
            value: lastPrice + trend * i + (Math.random() - 0.5) * (lastPrice * 0.01),
        });
    }

    return {
        predictedData,
        signal,
        confidence,
        rsiValue: Math.round(rsi),
    };
};
