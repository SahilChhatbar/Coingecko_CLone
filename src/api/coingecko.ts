import axios from 'axios';

export interface Cryptocurrency {
  id: string;
  market_cap_rank: number;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  total_volume: number;
  market_cap: number;
}

export type SortOrderType = 
  | "market_cap_desc" 
  | "market_cap_asc" 
  | "volume_desc" 
  | "volume_asc" 
  | "id_desc" 
  | "id_asc" 
  | "gecko_desc" 
  | "gecko_asc";

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = import.meta.env.COINGECKO_API_KEY;
const headers = API_KEY ? { 'x-cg-pro-api-key': API_KEY } : {};

export const fetchCryptoData = async (
  page: number, 
  perPage: number,
  sortOrder: SortOrderType = "market_cap_desc"
): Promise<Cryptocurrency[]> => {
  const endpoint = '/coins/markets';
  const params = {
    vs_currency: 'usd',
    order: sortOrder,
    per_page: perPage,
    page: page,
    sparkline: true,
    price_change_percentage: '1h,24h,7d',
  };

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

export const fetchCoinDetails = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch coin details');
  }
};
export const fetchCoinMarketChart = async (
  coinId: string, 
  days: string, 
  interval?: string
) => {
  const endpoint = `/coins/${coinId}/market_chart`;
  const params = {
    vs_currency: 'usd',
    days: days,
    interval: days === '1' ? 'hourly' : 'daily', 
  };

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch market chart data');
  }
};