'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, PieChart, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const timeframeData: Record<string, { name: string, value: number }[]> = {
  '1D': [
    { name: '09:30', value: 98500 }, { name: '10:00', value: 99200 }, { name: '10:30', value: 98800 },
    { name: '11:00', value: 100500 }, { name: '11:30', value: 101200 }, { name: '13:00', value: 100800 },
    { name: '13:30', value: 102500 }, { name: '14:00', value: 103800 }, { name: '14:30', value: 104200 },
    { name: '15:00', value: 103500 },
  ],
  '1W': [
    { name: '周一', value: 95000 }, { name: '周二', value: 97000 }, { name: '周三', value: 96500 },
    { name: '周四', value: 99000 }, { name: '周五', value: 103500 },
  ],
  '1M': [
    { name: '第1周', value: 92000 }, { name: '第2周', value: 94500 }, { name: '第3周', value: 98000 },
    { name: '第4周', value: 103500 },
  ],
};

export default function Dashboard() {
  const { balance, portfolio, stocks, setStocks, updateStockPrice, fetchAlpacaData } = useStore();
  const [currentTimeframe, setCurrentTimeframe] = useState('1D');
  const [chartData, setChartData] = useState(timeframeData['1D']);

  useEffect(() => {
    fetchAlpacaData();
    const fetchStocks = async () => {
      const res = await fetch('/api/stocks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStocks(data);
      }
    };
    fetchStocks();
  }, [fetchAlpacaData, setStocks]);

  // Simulated price updates
  useEffect(() => {
    const interval = setInterval(() => {
      stocks.forEach(stock => {
        const volatility = 0.002; // 0.2% max change per tick
        const change = 1 + (Math.random() * volatility * 2 - volatility);
        const newPrice = stock.price * change;
        updateStockPrice(stock.symbol, newPrice);
      });
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [stocks, updateStockPrice]);

  const totalAssetValue = portfolio.reduce((acc, asset) => {
    const stock = stocks.find(s => s.symbol === asset.symbol);
    return acc + (stock?.price || 0) * asset.quantity;
  }, 0);

  const totalValue = balance + totalAssetValue;
  const totalProfit = totalValue - 100000;
  const profitPercent = (totalProfit / 100000) * 100;

  const handleTimeframeChange = (timeframe: string) => {
    setCurrentTimeframe(timeframe);
    if (timeframeData[timeframe]) {
      setChartData(timeframeData[timeframe]);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm group hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
              <Wallet size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400">总资产净值</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tabular-nums">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className={cn("flex items-center gap-1 mt-2 text-sm font-medium", totalProfit >= 0 ? "text-green-400" : "text-red-400")}>
            {totalProfit >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({profitPercent.toFixed(2)}%)</span>
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm group hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500">
              <Activity size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400">可用资金</span>
          </div>
          <h3 className="text-2xl font-bold text-white tabular-nums">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-sm text-slate-500 mt-2 font-medium">占总资产 {(balance / totalValue * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm group hover:border-indigo-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
              <PieChart size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400">股票市值</span>
          </div>
          <h3 className="text-2xl font-bold text-white tabular-nums">${totalAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-sm text-slate-500 mt-2 font-medium">持仓标的 {portfolio.length} 个</p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm group hover:border-orange-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400">今日收益</span>
          </div>
          <h3 className="text-2xl font-bold text-white tabular-nums">+$1,420.50</h3>
          <p className="text-sm text-green-400 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight size={16} />
            +1.38%
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">资产走势图</h3>
              <p className="text-sm text-slate-500 font-medium">过去 24 小时内的资产价值波动</p>
            </div>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '3M', '1Y', 'All'].map((p) => (
                <button
                  key={p}
                  onClick={() => handleTimeframeChange(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200",
                    currentTimeframe === p ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-slate-500 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watchlist Section */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">热门自选</h3>
            <button className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">查看全部</button>
          </div>
          <div className="space-y-4 flex-1">
            {stocks.slice(0, 5).map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/50 transition-all duration-200 border border-transparent hover:border-slate-700 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-sm group-hover:bg-slate-700 transition-colors">
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{stock.symbol}</h4>
                    <p className="text-xs font-medium text-slate-500">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-sm tabular-nums">${stock.price.toFixed(2)}</p>
                  <p className={cn("text-xs font-bold flex items-center justify-end gap-1 mt-0.5", stock.change >= 0 ? "text-green-400" : "text-red-400")}>
                    {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
