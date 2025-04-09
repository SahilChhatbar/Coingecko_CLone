export interface PriceDataPoint {
    timestamp: number;
    price: number;
  }
  
  export type TimePeriod = '24h' | '7d' | '1m' | '3m' | '1y' | 'max';
  
 export const getPeriodDays = (period: TimePeriod): number | string => {
    switch (period) {
      case '24h': return 1;
      case '7d': return 7;
      case '1m': return 30;
      case '3m': return 90;
      case '1y': return 365;
      case 'max': return 'max';
    }
  };
  
   
  export const getPriceDomain = (priceData: PriceDataPoint[]): [number, number] => {
    if (priceData.length === 0) return [0, 0];
    
    const prices = priceData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.05;
    
    return [min - padding, max + padding];
  };
  
export const generateYAxisTicks = (priceData: PriceDataPoint[]): number[] => {
    if (priceData.length === 0) return [];
    
    const prices = priceData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
 if (max / min > 10) {
      const logMin = Math.floor(Math.log10(min));
      const logMax = Math.ceil(Math.log10(max));
      const ticks = [];
      for (let i = logMin; i <= logMax; i++) {
        ticks.push(Math.pow(10, i));
      }
      return ticks;
    }
    
    const step = (max - min) / 4;
    return Array(5).fill(0).map((_, i) => min + step * i);
  };
  
  export const isPriceIncreasing = (priceData: PriceDataPoint[]): boolean => {
    return priceData.length >= 2 && 
      priceData[priceData.length - 1].price > priceData[0].price;
  };
  
 export const getPriceColor = (increasing: boolean): string => {
    return increasing ? '#10B981' : '#EF4444';
  };