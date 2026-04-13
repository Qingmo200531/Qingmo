export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export interface Asset {
  symbol: string;
  quantity: number;
  averagePrice: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: number;
  status?: string;
}

export interface UserState {
  balance: number;
  portfolio: Asset[];
  transactions: Transaction[];
  stocks: Stock[];
}
