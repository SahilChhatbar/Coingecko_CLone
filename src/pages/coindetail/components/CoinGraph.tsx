import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, Text, Group, Loader, SegmentedControl, Paper } from "@mantine/core";
import { fetchCoinMarketChart } from "../../../api/coingecko";
import { formatChartDate } from "../../../utils/utilityfunctions/date";
import { formatPrice } from "../../../utils/utilityfunctions/price";
import { PriceDataPoint, TimePeriod, getPeriodDays, getPriceDomain, generateYAxisTicks, isPriceIncreasing, getPriceColor } from '../../../utils/utilityfunctions/chart';
import { Coin } from '../../../types/cryptotypes';


interface CoinGraphProps {
  coin: Coin;
}
export default function CoinGraph({ coin }: CoinGraphProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7d');
  const [selectedPoint, setSelectedPoint] = useState<PriceDataPoint | null>(null);

  const { data: priceData = [], isLoading, error } = useQuery({
    queryKey: ['coinMarketChart', coin.id, selectedPeriod],
    queryFn: async () => {
      const days = getPeriodDays(selectedPeriod);
      const data = await fetchCoinMarketChart(coin.id, days.toString());
      return data.prices.map((item: [number, number]) => ({
        timestamp: item[0],
        price: item[1],
      }));
    },
    staleTime: 300000, 
  });
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper shadow="md" p="md" radius="md" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Text size="sm" className="font-medium">
            {formatChartDate(data.timestamp, selectedPeriod)}
          </Text>
          <Text size="md" className="font-bold">
            {formatPrice(data.price)}
          </Text>
        </Paper>
      );
    }
    return null;
  };
  const priceIsIncreasing = isPriceIncreasing(priceData);
  const lineColor = getPriceColor(priceIsIncreasing);
  const renderGradient = () => (
    <defs>
      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
        <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
  return (
    <Card p="md" className="w-full md:w-2/3">
      <Group gap="apart" mb="md">
        <Text size="xl" fw={700} className="flex items-center">
          {coin?.name} Price Chart
        </Text>
        <SegmentedControl
          value={selectedPeriod}
          onChange={(value) => setSelectedPeriod(value as TimePeriod)}
          data={[
            { label: '7d', value: '7d' },
            { label: '1m', value: '1m' },
            { label: '3m', value: '3m' },
            { label: '1y', value: '1y' },
          ]}
          className="bg-gray-100 dark:bg-gray-800"
        />
      </Group>
      {selectedPoint && (
        <Group gap="xs" className="text-gray-600 dark:text-gray-300 mb-4">
          <Text size="sm">{formatChartDate(selectedPoint.timestamp, selectedPeriod)}:</Text>
          <Text size="sm" className="font-bold">{formatPrice(selectedPoint.price)}</Text>
        </Group>
      )}
      <div className="h-64 md:h-80">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <Text c="red">Failed to load price data</Text>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              onMouseMove={(e) => {
                if (e.activePayload) {
                  setSelectedPoint(e.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setSelectedPoint(null)}
            >
              {renderGradient()}
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp) => formatChartDate(timestamp, selectedPeriod)}
                type="number"
                domain={['dataMin', 'dataMax']}
                tickCount={5}
                tick={{ fontSize: 12 }}
                stroke="#888888"
              />
              <YAxis 
                domain={getPriceDomain(priceData)}
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
                width={80}
                stroke="#888888"
                ticks={generateYAxisTicks(priceData)}
                scale={selectedPeriod === 'max' ? 'log' : 'auto'}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={lineColor} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2, fill: '#fff' }}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}