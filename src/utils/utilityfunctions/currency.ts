export const CURRENCY_FORMAT = {
    LOCALE: 'en-US',
    CURRENCY: 'USD'
  };
  
  export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(CURRENCY_FORMAT.LOCALE, {
      style: "currency",
      currency: CURRENCY_FORMAT.CURRENCY,
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };
  
  export const cryptoToUsd = (cryptoAmount: number, currentPrice: number): number => {
    return cryptoAmount * currentPrice;
  };
  
  export const usdToCrypto = (usdAmount: number, currentPrice: number): number => {
    if (currentPrice === 0) return 0;
    return usdAmount / currentPrice;
  };
  
  export const formatCryptoToUsd = (cryptoAmount: number, currentPrice: number): string => {
    const usdValue = cryptoToUsd(cryptoAmount, currentPrice);
    return formatCurrency(usdValue);
  };
  
  export const formatUsdToCrypto = (usdAmount: number, currentPrice: number, cryptoSymbol: string): string => {
    const cryptoValue = usdToCrypto(usdAmount, currentPrice);
    const formatted = cryptoValue.toLocaleString(CURRENCY_FORMAT.LOCALE, {
      minimumFractionDigits: cryptoValue < 0.001 ? 8 : cryptoValue < 1 ? 6 : 4,
      maximumFractionDigits: cryptoValue < 0.001 ? 8 : cryptoValue < 1 ? 6 : 4,
    });
    return `${formatted} ${cryptoSymbol.toUpperCase()}`;
  };