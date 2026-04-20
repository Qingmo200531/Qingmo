import { NextResponse } from 'next/server';
import alpaca from '@/lib/alpaca';

export async function GET() {
  console.log('--- 开始连接 Alpaca 账户 ---');
  console.log('API Key ID:', process.env.ALPACA_API_KEY ? '已设置' : '未设置');
  console.log('API Secret:', process.env.ALPACA_API_SECRET ? '已设置' : '未设置');

  try {
    const account = await alpaca.getAccount();
    console.log('✅ Alpaca 连接成功，账户状态:', account.status);
    
    const positions = await alpaca.getPositions();
    
    return NextResponse.json({
      balance: parseFloat(account.cash),
      portfolio: positions.map((p: any) => ({
        symbol: p.symbol,
        quantity: parseInt(p.qty),
        averagePrice: parseFloat(p.avg_entry_price),
        currentPrice: parseFloat(p.current_price),
      })),
      equity: parseFloat(account.equity),
    });
  } catch (error: any) {
    console.error('❌ Alpaca 连接发生错误:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
