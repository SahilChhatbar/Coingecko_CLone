import axios from 'axios';

interface Cryptocurrency {
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

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = import.meta.env.COINGECKO_API_KEY;

export const fetchCryptoData = async (page: number, perPage: number): Promise<Cryptocurrency[]> => {
  const endpoint = '/coins/markets';
  const params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage,
    page: page,
    sparkline: false,
    price_change_percentage: '1h,24h,7d',
  };

  const headers = API_KEY ? { 'x-cg-pro-api-key': API_KEY } : {};
  
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch crypto data');
  }
};