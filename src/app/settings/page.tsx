'use client';

import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Languages, Moon, Sun, ChevronRight, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      alert('已退出登录 (模拟操作)');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme');
    alert(`已切换至 ${newTheme === 'dark' ? '深色' : '浅色'} 模式 (演示效果)`);
  };

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    alert(`已切换至 ${newLang === 'zh' ? '中文' : '英文'}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 shadow-xl">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">系统设置</h2>
          <p className="text-slate-400 mt-1 font-medium text-sm">管理您的个人偏好与账户安全</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Section */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User size={20} className="text-blue-500" />
            个人资料
          </h3>
          <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-blue-900/20">
              P
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white">清沫用户</h4>
              <p className="text-sm text-slate-500 font-medium">qingmo_user@example.com</p>
            </div>
            <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700">
              编辑资料
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm space-y-6">
          <h3 className="text-lg font-bold text-white">偏好设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/30 transition-all cursor-pointer group border border-transparent hover:border-slate-700/50" onClick={toggleTheme}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">界面主题</h4>
                  <p className="text-xs text-slate-500 mt-0.5">当前为 {theme === 'dark' ? '深色' : '浅色'} 模式</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/30 transition-all cursor-pointer group border border-transparent hover:border-slate-700/50" onClick={toggleLanguage}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <Languages size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">语言语种</h4>
                  <p className="text-xs text-slate-500 mt-0.5">当前语言: {language === 'zh' ? '简体中文' : 'English'}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/30 transition-all cursor-pointer group border border-transparent hover:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">通知设置</h4>
                  <p className="text-xs text-slate-500 mt-0.5">管理价格预警与系统消息</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm space-y-6">
          <h3 className="text-lg font-bold text-white">账户安全</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/30 transition-all cursor-pointer group border border-transparent hover:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">密码与安全</h4>
                  <p className="text-xs text-slate-500 mt-0.5">修改登录密码与双重认证</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/30 transition-all cursor-pointer group border border-transparent hover:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">帮助与支持</h4>
                  <p className="text-xs text-slate-500 mt-0.5">查看常见问题或联系客服</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 font-black py-5 rounded-3xl transition-all shadow-xl shadow-red-950/10 active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
