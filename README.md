# 清沫证券交易所 (Qingmo Stock Exchange)

一个基于 Next.js 15 和 Alpaca API 构建的专业级模拟证券交易平台。支持全球 10,000+ 标的实时行情、模拟下单、持仓管理及资产走势分析。

## 🌟 核心功能
- **全球行情**: 实时获取美股及全球知名企业 (ADR) 的市场数据。
- **模拟交易**: 深度集成 Alpaca Paper Trading，支持真实模拟买入、卖出及撤单。
- **资产分析**: 动态展示总资产净值、盈亏比例及历史走势图 (1D/1W/1M)。
- **响应式设计**: 适配桌面端与移动端，提供深色/浅色模式切换。

## 🛠️ 技术栈
- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS v4
- **状态管理**: Zustand
- **图表**: Recharts
- **API**: Alpaca Trade API

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/qingmo-exchange.git
cd qingmo-exchange
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
在项目根目录创建 `.env.local` 文件，并填入您的 Alpaca API 密钥：
```env
ALPACA_API_KEY=your_api_key_here
ALPACA_API_SECRET=your_api_secret_here
ALPACA_BASE_URL=https://paper-api.alpaca.markets
```

### 4. 启动开发服务器
```bash
npm run dev
```
访问 `http://localhost:3000` 即可开始交易。

## 📄 部署
推荐使用 [Vercel](https://vercel.com) 进行一键部署。请确保在 Vercel 控制台中配置相应的环境变量。

---
由 清沫证券交易所 开发团队提供支持
