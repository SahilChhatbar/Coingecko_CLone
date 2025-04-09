export const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  
  export const formatChartDate = (timestamp: number, period: string): string => {
    const date = new Date(timestamp);
    
    if (period === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: period === '7d' || period === '1m' ? undefined : 'numeric'
    });
  };