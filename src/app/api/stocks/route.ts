import { NextResponse } from 'next/server';
import alpaca from '@/lib/alpaca';

let cachedAssets: any[] = [];
let lastCacheTime = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const symbolsParam = searchParams.get('symbols');

  try {
    // 1. Get or cache assets for searching and metadata
    if (cachedAssets.length === 0 || Date.now() - lastCacheTime > 1000 * 60 * 60) {
      cachedAssets = await alpaca.getAssets({
        status: 'active',
        asset_class: 'us_equity',
      });
      lastCacheTime = Date.now();
    }

    // 2. Search logic
    if (search) {
      const filtered = cachedAssets
        .filter((a: any) => 
          a.symbol.toLowerCase().startsWith(search.toLowerCase()) || 
          a.name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 10);
        
      return NextResponse.json(filtered.map((a: any) => ({
        symbol: a.symbol,
        name: a.name,
        exchange: a.exchange,
      })));
    }

    // 3. Default and symbol fetch logic
    const defaultSymbols = [
      // US Tech
      'AAPL','GOOGL','MSFT','TSLA','AMZN','META','NVDA','NFLX','DIS','INTC','AMD',
      // Global ADRs (International Companies on US Exchanges)
      'BABA','TSM','NVO','ASML','TM','SAP','HSBC','AZN','RY','SNY','SONY','BP',
      // Finance & Consumer
      'V','JPM','MA','WMT','KO','PEP','PG','JNJ','PFE','XOM','CVX','BA'
    ];
    
    const targetSymbols = symbolsParam ? symbolsParam.split(',') : defaultSymbols;
    
    // Get latest bars for current price information
    const latestBars = await alpaca.getLatestBars(targetSymbols);
    const assetMap = new Map(cachedAssets.map((a: any) => [a.symbol, a.name]));

    const stocks = targetSymbols.map(symbol => {
      const bar = latestBars instanceof Map ? latestBars.get(symbol) : latestBars[symbol];
      if (!bar) return null;
      
      return {
        symbol: symbol,
        name: assetMap.get(symbol) || symbol,
        price: bar.ClosePrice || bar.Close || bar.c || 0,
        high: bar.HighPrice || bar.High || bar.h || 0,
        low: bar.LowPrice || bar.Low || bar.l || 0,
        volume: bar.Volume || bar.v || 0,
        change: 0,
        changePercent: 0,
      };
    }).filter(Boolean);

    return NextResponse.json(stocks);
  } catch (error: any) {
    console.error('Alpaca API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
