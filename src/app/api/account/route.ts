import { NextResponse } from 'next/server';
import alpaca from '@/lib/alpaca';

export async function GET() {
  try {
    const account = await alpaca.getAccount();
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
