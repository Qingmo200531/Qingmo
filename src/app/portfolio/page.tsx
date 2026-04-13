'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Briefcase, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, PieChart, Activity, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const { portfolio, stocks, balance } = useStore();
  const router = useRouter();

  const portfolioWithData = portfolio.map(asset => {
    const stock = stocks.find(s => s.symbol === asset.symbol);
    const currentValue = (stock?.price || 0) * asset.quantity;
    const costValue = asset.averagePrice * asset.quantity;
    const profit = currentValue - costValue;
    const profitPercent = (profit / costValue) * 100;
    
    return {
      ...asset,
      name: stock?.name || '未知资产',
      currentPrice: stock?.price || 0,
      currentValue,
      profit,
      profitPercent,
    };
  });

  const totalAssetValue = portfolioWithData.reduce((acc, asset) => acc + asset.currentValue, 0);
  const totalProfit = portfolioWithData.reduce((acc, asset) => acc + asset.profit, 0);
  const totalValue = balance + totalAssetValue;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">我的持仓</h2>
          <p className="text-slate-400 mt-1 font-medium text-sm">管理您的证券资产组合并监控实时盈亏</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
            <PieChart size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">当前总资产</p>
            <p className="text-xl font-black text-white tabular-nums">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400">累计盈亏</span>
          </div>
          <h3 className={cn("text-2xl font-black tabular-nums", totalProfit >= 0 ? "text-green-400" : "text-red-400")}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className={cn("text-sm font-bold mt-1 flex items-center gap-1", totalProfit >= 0 ? "text-green-400" : "text-red-400")}>
            {totalProfit >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {((totalProfit / (totalValue - totalProfit)) * 100).toFixed(2)}%
          </p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
              <Briefcase size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400">持仓市值</span>
          </div>
          <h3 className="text-2xl font-black text-white tabular-nums">${totalAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-sm text-slate-500 mt-1 font-bold">占总资产 {(totalAssetValue / totalValue * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-500">
              <Activity size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400">资产回报率</span>
          </div>
          <h3 className="text-2xl font-black text-white tabular-nums">12.45%</h3>
          <p className="text-sm text-slate-500 mt-1 font-bold">年化预估</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-6 px-8 py-5 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>资产标的</span>
          <span className="text-right">持有数量 / 均价</span>
          <span className="text-right">当前价格 / 市值</span>
          <span className="text-right">浮动盈亏</span>
          <span className="text-right">持仓占比</span>
          <span className="text-right">操作</span>
        </div>
        <div className="divide-y divide-slate-800/50">
          {portfolioWithData.length > 0 ? (
            portfolioWithData.map((asset) => (
              <div key={asset.symbol} className="grid grid-cols-6 px-8 py-6 items-center hover:bg-slate-800/30 transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-sm group-hover:bg-slate-700 transition-colors shadow-sm">
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{asset.symbol}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-sm tabular-nums">{asset.quantity} 股</p>
                  <p className="text-[10px] font-bold text-slate-500 tabular-nums">${asset.averagePrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-sm tabular-nums">${asset.currentPrice.toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-slate-500 tabular-nums">${asset.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <p className={cn("font-bold text-sm tabular-nums", asset.profit >= 0 ? "text-green-400" : "text-red-400")}>
                    {asset.profit >= 0 ? '+' : ''}${asset.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className={cn("text-[10px] font-bold tabular-nums", asset.profit >= 0 ? "text-green-400" : "text-red-400")}>
                    {asset.profit >= 0 ? '+' : ''}{asset.profitPercent.toFixed(2)}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${(asset.currentValue / totalAssetValue * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-white tabular-nums">{(asset.currentValue / totalAssetValue * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => router.push(`/market?symbol=${asset.symbol}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <ShoppingCart size={14} />
                    卖出
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-600">
                <Briefcase size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">暂无持仓</h3>
                <p className="text-sm text-slate-500 font-medium max-w-[250px] mx-auto mt-1">您目前没有任何证券资产，前往市场页面开始您的第一笔交易吧。</p>
                <button className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-900/30 active:scale-95 text-sm">
                  前往交易
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
