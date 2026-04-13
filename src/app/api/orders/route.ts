import { NextResponse } from 'next/server';
import alpaca from '@/lib/alpaca';

export async function POST(request: Request) {
  const body = await request.json();
  const { symbol, quantity, type, side } = body;

  try {
    const order = await alpaca.createOrder({
      symbol,
      qty: quantity,
      side: side, // 'buy' or 'sell'
      type: type || 'market',
      time_in_force: 'gtc',
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
  }

  try {
    await alpaca.cancelOrder(orderId);
    return NextResponse.json({ message: 'Order canceled successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await alpaca.getOrders({
      status: 'all',
      limit: 50,
    });

    return NextResponse.json(orders.map((o: any) => ({
      id: o.id,
      symbol: o.symbol,
      type: o.side.toUpperCase(),
      price: parseFloat(o.filled_avg_price) || 0,
      quantity: parseInt(o.qty),
      timestamp: new Date(o.created_at).getTime(),
      status: o.status,
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
