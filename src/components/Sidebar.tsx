'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Briefcase, History, Settings, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

const navItems = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '市场行情', href: '/market', icon: TrendingUp },
  { name: '我的持仓', href: '/portfolio', icon: Briefcase },
  { name: '交易记录', href: '/history', icon: History },
  { name: '设置', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { balance } = useStore();

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white h-screen border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">清沫证券交易所</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-white"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">
            <Wallet size={12} />
            <span>可用余额</span>
          </div>
          <div className="text-xl font-bold text-white tabular-nums">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
