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


export interface ProPredictionResult extends PredictionResult {
    trend4h: 'UP' | 'DOWN' | 'NEUTRAL';
    volumeAnalysis: 'HIGH' | 'LOW' | 'NORMAL';
    signals: string[];
}

export const analyzeVolume = (data: PriceData[]): 'HIGH' | 'LOW' | 'NORMAL' => {
    if (data.length < 10) return 'NORMAL';
    const recent = data.slice(-5);
    const older = data.slice(-10, -5);

    const avgRecent = recent.reduce((sum, d) => sum + d.volume, 0) / 5;
    const avgOlder = older.reduce((sum, d) => sum + d.volume, 0) / 5;

    if (avgRecent > avgOlder * 1.5) return 'HIGH';
    if (avgRecent < avgOlder * 0.5) return 'LOW';
    return 'NORMAL';
};

// We need to update PriceData interface in dataService first to include volume if it's missing
// But for now, let's stick to the current logic and just enhance the EMA/RSI combination

export const generatePrediction = (data: PriceData[], data4h?: PriceData[]): ProPredictionResult => {
    const closes = data.map((d) => d.close);
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    const rsi = calculateRSI(closes, 14);
    const volAnalysis = analyzeVolume(data);

    const lastPrice = closes[closes.length - 1];
    const lastEMA20 = ema20[ema20.length - 1];
    const lastEMA50 = ema50[ema50.length - 1];

    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 50;
    const signals: string[] = [];

    // Trend Analysis (Use 4h data if available, else fallback to daily)
    let isUptrend = lastPrice > lastEMA50;
    if (data4h && data4h.length > 50) {
        const closes4h = data4h.map(d => d.close);
        const ema50_4h = calculateEMA(closes4h, 50);
        const lastEMA50_4h = ema50_4h[ema50_4h.length - 1];
        const lastPrice4h = closes4h[closes4h.length - 1];
        isUptrend = lastPrice4h > lastEMA50_4h;
        signals.push(`4H Trend is ${isUptrend ? 'BULLISH' : 'BEARISH'}`);
    } else {
        signals.push(`Daily Trend is ${isUptrend ? 'UP' : 'DOWN'}`);
    }

    const trend4h = isUptrend ? 'UP' : 'DOWN';

    // Volume Confirmation
    if (volAnalysis === 'HIGH') {
        signals.push('High Volume Confirmation');
        confidence += 10;
    } else if (volAnalysis === 'LOW') {
        signals.push('Low Volume (Weak Trend)');
        confidence -= 10;
    }

    // RSI Logic
    if (rsi < 30) {
        signals.push('RSI Oversold (<30)');
        if (isUptrend) {
            signal = 'BUY';
            confidence += 30;
        } else {
            confidence += 10; // Potential reversal
        }
    } else if (rsi > 70) {
        signals.push('RSI Overbought (>70)');
        if (!isUptrend) {
            signal = 'SELL';
            confidence += 30;
        } else {
            confidence += 10;
        }
    }

    // EMA Crossover Logic (Golden/Death Cross proxy)
    if (lastEMA20 > lastEMA50) {
        signals.push('Bullish EMA Alignment');
        if (signal === 'BUY') confidence += 10;
    } else {
        signals.push('Bearish EMA Alignment');
        if (signal === 'SELL') confidence += 10;
    }

    // Cap confidence
    confidence = Math.min(confidence, 98);

    const predictedData = [];
    const lastTime = data[data.length - 1].time;
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
        trend4h,
        volumeAnalysis: 'NORMAL',
        signals
    };
};
