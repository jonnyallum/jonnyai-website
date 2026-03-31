import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { amount, productName, customerEmail } = await req.json();

    if (!amount || !productName) {
      return NextResponse.json({ error: 'Missing amount or productName' }, { status: 400 });
    }

    const baseUrl = req.headers.get('origin') || 'https://jonnyai.co.uk';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: Math.round(amount * 100), // pence
            product_data: {
              name: productName,
              description: 'JonnyAI — Private AI Installation & Automation Services.',
            },
          },
        },
      ],
      success_url: `${baseUrl}/dashboard/new?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/brief`,
      metadata: {
        source: 'jonnyai-brief-funnel',
        product: productName,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
