import { create } from 'zustand';
import { Stock, Asset, Transaction, UserState } from '@/types';

interface AppStore extends UserState {
  setBalance: (balance: number) => void;
  setPortfolio: (portfolio: Asset[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setStocks: (stocks: Stock[]) => void;
  updateStockPrice: (symbol: string, newPrice: number) => void;
  buyStock: (symbol: string, quantity: number, price: number) => Promise<void>;
  sellStock: (symbol: string, quantity: number, price: number) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  initializeStocks: (stocks: Stock[]) => void;
  fetchAlpacaData: () => Promise<void>;
}

export const useStore = create<AppStore>((set, get) => ({
  balance: 100000, // Initial balance: $100,000
  portfolio: [],
  transactions: [],
  stocks: [],

  setBalance: (balance) => set({ balance }),
  setPortfolio: (portfolio) => set({ portfolio }),
  setTransactions: (transactions) => set({ transactions }),
  setStocks: (stocks) => set({ stocks }),

  initializeStocks: (stocks) => set({ stocks }),

  fetchAlpacaData: async () => {
    try {
      const [accountRes, ordersRes] = await Promise.all([
        fetch('/api/account'),
        fetch('/api/orders')
      ]);

      const accountData = await accountRes.json();
      const ordersData = await ordersRes.json();

      if (accountData.balance !== undefined) {
        set({
          balance: accountData.balance,
          portfolio: accountData.portfolio
        });
      }

      if (Array.isArray(ordersData)) {
        set({ transactions: ordersData });
      }
    } catch (error) {
      console.error('Error fetching Alpaca data:', error);
    }
  },

  updateStockPrice: (symbol, newPrice) =>
    set((state) => ({
      stocks: state.stocks.map((s) => {
        if (s.symbol === symbol) {
          const change = newPrice - s.price;
          const changePercent = (change / s.price) * 100;
          return {
            ...s,
            price: newPrice,
            change,
            changePercent,
            high: Math.max(s.high, newPrice),
            low: Math.min(s.low, newPrice),
          };
        }
        return s;
      }),
    })),

  buyStock: async (symbol, quantity, price) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, quantity, side: 'buy' })
      });
      if (res.ok) {
        await get().fetchAlpacaData();
      }
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  },

  sellStock: async (symbol, quantity, price) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, quantity, side: 'sell' })
      });
      if (res.ok) {
        await get().fetchAlpacaData();
      }
    } catch (error) {
      console.error('Error selling stock:', error);
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await get().fetchAlpacaData();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },
}));
