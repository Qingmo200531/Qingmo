'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { Search, TrendingUp, TrendingDown, Info, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

function MarketContent() {
  const { stocks, buyStock, sellStock, balance, setStocks } = useStore();
  const searchParams = useSearchParams();
  const urlSymbol = searchParams.get('symbol');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchInitialStocks = async () => {
      try {
        const res = await fetch('/api/stocks');
        if (!res.ok) throw new Error('获取市场数据失败');
        const data = await res.json();
        if (Array.isArray(data)) {
          setStocks(data);
        }
      } catch (error) {
        console.error('Initial stocks fetch error:', error);
      }
    };
    fetchInitialStocks();
  }, [setStocks]);

  useEffect(() => {
    if (urlSymbol && stocks.length > 0) {
      const stock = stocks.find(s => s.symbol === urlSymbol);
      if (stock) {
        setSelectedStock(stock);
      } else {
        const fetchStock = async () => {
          const res = await fetch(`/api/stocks?symbols=${urlSymbol}`);
          const data = await res.json();
          if (data && data.length > 0) {
            setSelectedStock(data[0]);
          }
        };
        fetchStock();
      }
    }
  }, [urlSymbol, stocks]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/stocks?search=${searchTerm}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleBuy = async () => {
    if (!selectedStock) return;
    try {
      await buyStock(selectedStock.symbol, quantity, selectedStock.price);
      alert(`成功下单买入 ${quantity} 股 ${selectedStock.symbol}，请在交易历史中查看状态`);
    } catch (error: any) {
      alert(`下单失败: ${error.message}`);
    }
  };

  const handleSell = async () => {
    if (!selectedStock) return;
    try {
      await sellStock(selectedStock.symbol, quantity, selectedStock.price);
      alert(`成功下单卖出 ${quantity} 股 ${selectedStock.symbol}，请在交易历史中查看状态`);
    } catch (error: any) {
      alert(`下单失败: ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">市场行情</h2>
          <p className="text-slate-400 mt-1 font-medium text-sm">探索并交易全球热门证券资产</p>
        </div>
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="搜索代码或公司名称 (如 AAPL, TSLA)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {searchTerm && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden z-20 shadow-2xl">
              {searchResults.map((result: any) => (
                <div 
                  key={result.symbol}
                  className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                  onClick={async () => {
                    setSearchTerm('');
                    setSearchResults([]);
                    const res = await fetch(`/api/stocks?symbols=${result.symbol}`);
                    const data = await res.json();
                    if (data && data.length > 0) {
                      setSelectedStock({ ...data[0], name: result.name });
                    } else {
                      setSelectedStock({ symbol: result.symbol, name: result.name, price: 0, changePercent: 0, high: 0, low: 0, volume: 0 });
                    }
                  }}
                >
                  <div>
                    <span className="font-bold text-white">{result.symbol}</span>
                    <span className="text-xs text-slate-500 ml-2">{result.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded">{result.exchange}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-sm">
            <div className="grid grid-cols-4 px-6 py-4 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>资产代码</span>
              <span className="text-right">当前价格</span>
              <span className="text-right">涨跌幅</span>
              <span className="text-right">操作</span>
            </div>
            <div className="divide-y divide-slate-800/50">
              {stocks.length > 0 ? (
                stocks.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    className={cn(
                      "grid grid-cols-4 px-6 py-5 items-center hover:bg-slate-800/30 transition-all duration-200 cursor-pointer group",
                      selectedStock?.symbol === stock.symbol ? "bg-blue-600/5 border-l-4 border-blue-500" : "border-l-4 border-transparent"
                    )}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs group-hover:bg-slate-700 transition-colors">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm tracking-tight">{stock.symbol}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[120px]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right font-bold text-sm text-white tabular-nums">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={cn("text-right font-bold text-sm tabular-nums flex items-center justify-end gap-1", stock.change >= 0 ? "text-green-400" : "text-red-400")}>
                      {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="flex justify-end">
                      <button className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm">
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-500 text-sm font-medium">正在实时获取市场行情数据...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm sticky top-8">
            {selectedStock ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{selectedStock.symbol}</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedStock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white tabular-nums">${selectedStock.price.toFixed(2)}</p>
                    <p className={cn("text-sm font-bold tabular-nums", selectedStock.change >= 0 ? "text-green-400" : "text-red-400")}>
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-800">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">今日最高</p>
                    <p className="text-sm font-bold text-white tabular-nums">${selectedStock.high.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">今日最低</p>
                    <p className="text-sm font-bold text-white tabular-nums">${selectedStock.low.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">成交量</p>
                    <p className="text-sm font-bold text-white tabular-nums">{(selectedStock.volume / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">可用余额</p>
                    <p className="text-sm font-bold text-emerald-400 tabular-nums">${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">交易数量</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all tabular-nums"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-bold text-slate-400">预计总额</span>
                    <span className="text-lg font-black text-white tabular-nums">${(quantity * selectedStock.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button 
                      onClick={handleBuy}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/30 active:scale-95"
                    >
                      买入
                    </button>
                    <button 
                      onClick={handleSell}
                      className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 font-black py-4 rounded-2xl transition-all active:scale-95"
                    >
                      卖出
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-600">
                  <Info size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">选择资产</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-[200px] mx-auto mt-1">从左侧列表中选择一个证券资产以开始交易</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MarketContent />
    </Suspense>
  );
}
