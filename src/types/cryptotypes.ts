import { SortOrderType } from "../api/coingecko";

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d?: {
    price: number[];
  };
}

export type CryptoDataQueryKey = ["cryptoData", SortOrderType];

export interface ColumnSortOptions {
  [key: string]: {
    asc: SortOrderType;
    desc: SortOrderType;
  };
}

export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_cap_rank: number;
  links: {
    homepage: string[];
    whitepaper?: string;
    subreddit_url?: string;
    twitter_screen_name?: string;
    facebook_url?: string;
    repos_url?: {
      github?: string[];
    };
  };
  market_data: MarketData;
}

export interface MarketData {
  current_price: {
    usd: number;
    btc: number;
  };
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency?: {
    btc: number;
  };
  low_24h: {
    usd: number;
  };
  high_24h: {
    usd: number;
  };
  market_cap: {
    usd: number;
  };
  fully_diluted_valuation?: {
    usd?: number;
  };
  total_volume: {
    usd: number;
  };
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath: {
    usd: number;
  };
  ath_change_percentage: {
    usd: number;
  };
  ath_date: {
    usd: string;
  };
  atl: {
    usd: number;
  };
  atl_change_percentage: {
    usd: number;
  };
  atl_date: {
    usd: string;
  };
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      usd: number;
      btc: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_24h_in_currency: {
      btc: number;
    };
    low_24h: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    fully_diluted_valuation?: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    circulating_supply: number;
    total_supply?: number;
    max_supply?: number;
  };
}