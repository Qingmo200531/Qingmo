'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { History, ShoppingCart, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const { transactions, cancelOrder } = useStore();

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      alert('订单已成功撤销');
    } catch (error: any) {
      alert(`撤单失败: ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">交易记录</h2>
          <p className="text-slate-400 mt-1 font-medium text-sm">查看您的所有历史买入和卖出操作记录</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">总计成交</p>
            <p className="text-xl font-black text-white tabular-nums">{transactions.length} 笔</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-6 px-8 py-5 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>资产代码</span>
          <span className="text-right">交易类型</span>
          <span className="text-right">成交价格</span>
          <span className="text-right">成交数量</span>
          <span className="text-right">成交时间</span>
          <span className="text-right">操作</span>
        </div>
        <div className="divide-y divide-slate-800/50">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="grid grid-cols-6 px-8 py-6 items-center hover:bg-slate-800/30 transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-sm group-hover:bg-slate-700 transition-colors shadow-sm">
                    {tx.symbol[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{tx.symbol}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">市场成交</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                    tx.type === 'BUY' ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" : "bg-red-600/10 text-red-400 border border-red-500/20"
                  )}>
                    {tx.type === 'BUY' ? '买入' : '卖出'}
                  </span>
                </div>
                <div className="text-right font-bold text-white text-sm tabular-nums">
                  ${tx.price.toFixed(2)}
                </div>
                <div className="text-right font-bold text-white text-sm tabular-nums">
                  {tx.quantity} 股
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-300 tabular-nums">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 tabular-nums uppercase">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex justify-end">
                  {['new', 'accepted', 'partially_filled', 'pending_new'].includes(tx.status || '') && (
                    <button 
                      onClick={() => handleCancel(tx.id)}
                      className="px-4 py-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                    >
                      撤销
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-600">
                <History size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">暂无交易记录</h3>
                <p className="text-sm text-slate-500 font-medium max-w-[250px] mx-auto mt-1">您目前还没有进行过任何买入或卖出交易操作。</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
