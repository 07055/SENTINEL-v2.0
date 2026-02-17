export interface PriceData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

/**
 * Fetches real market data from Binance API
 * @param symbol The trading pair (e.g., BTCUSDT)
 * @param interval The timeframe (e.g., 1d, 1h, 15m)
 * @param limit Number of data points to fetch
 */
export const fetchMarketData = async (
    symbol: string = 'BTCUSDT',
    interval: string = '1d',
    limit: number = 100
): Promise<PriceData[]> => {
    try {
        const response = await fetch(
            `/api/binance?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map Binance kline format to our PriceData format
        // Binance format: [openTime, open, high, low, close, volume, closeTime, ...]
        return data.map((d: any[]) => ({
            time: Math.floor(d[0] / 1000), // Convert ms to seconds
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
            volume: parseFloat(d[5]),
        }));
    } catch (error) {
        console.error("Failed to fetch market data:", error);
        // Fallback to empty array or previously mocked logic if needed
        return [];
    }
};
