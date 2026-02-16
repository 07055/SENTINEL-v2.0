'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickData, LineData, CandlestickSeries, LineSeries } from 'lightweight-charts';

interface TradingChartProps {
    data: CandlestickData[];
    predictionData?: LineData[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export const TradingChart = ({
    data,
    predictionData,
    colors: {
        backgroundColor = '#0a0a0b',
        lineColor = '#2962FF',
        textColor = '#d1d4dc',
    } = {},
}: TradingChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'>>(null!);
    const predictionSeriesRef = useRef<ISeriesApi<'Line'>>(null!);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            grid: {
                vertLines: { color: '#1f2937' },
                horzLines: { color: '#1f2937' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                borderColor: '#374151',
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        const predictionSeries = chart.addSeries(LineSeries, {
            color: '#3b82f6',
            lineWidth: 2,
            lineStyle: 2, // Dashed
        });

        candlestickSeries.setData(data);
        if (predictionData) {
            predictionSeries.setData(predictionData);
        }

        chartRef.current = chart;
        candlestickSeriesRef.current = candlestickSeries;
        predictionSeriesRef.current = predictionSeries;

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, textColor]);

    useEffect(() => {
        if (predictionSeriesRef.current && predictionData) {
            predictionSeriesRef.current.setData(predictionData);
        }
    }, [predictionData]);

    return <div ref={chartContainerRef} className="w-full rounded-xl overflow-hidden border border-gray-800 bg-[#0a0a0b] p-4" />;
};
