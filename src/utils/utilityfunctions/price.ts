export const formatPrice = (price: number): string => {
    if (price > 1000) {
      return `$${price.toLocaleString()}`;
    } else if (price > 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };
  
  export const calculatePriceProgressInRange = (
    current: number,
    min: number,
    max: number
  ): number => {
    if (max === min) return 50;
    return ((current - min) / (max - min)) * 100;
  };
  
  export const cryptoToUsd = (cryptoAmount: number, currentPrice: number): number => {
    return cryptoAmount * currentPrice;
  };
  
  export const usdToCrypto = (usdAmount: number, currentPrice: number): number => {
    if (currentPrice === 0) return 0;
    return usdAmount / currentPrice;
  };