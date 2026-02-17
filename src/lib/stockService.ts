export interface StockData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const API_KEY = 'demo'; // Using 'demo' for development. User should replace with real key.

export const fetchStockData = async (symbol: string = 'IBM'): Promise<StockData[]> => {
    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Alpha Vantage API Error');
        }

        const data = await response.json();
        const timeSeries = data['Time Series (Daily)'];

        if (!timeSeries) {
            return [];
        }

        return Object.keys(timeSeries)
            .slice(0, 100) // Limit to 100 datapoints
            .map((dateString) => {
                const point = timeSeries[dateString];
                return {
                    time: new Date(dateString).getTime() / 1000,
                    open: parseFloat(point['1. open']),
                    high: parseFloat(point['2. high']),
                    low: parseFloat(point['3. low']),
                    close: parseFloat(point['4. close']),
                    volume: parseFloat(point['5. volume']),
                };
            })
            .reverse(); // Lightweight charts expects ascending order
    } catch (error) {
        console.error("Failed to fetch stock data:", error);
        return [];
    }
};
