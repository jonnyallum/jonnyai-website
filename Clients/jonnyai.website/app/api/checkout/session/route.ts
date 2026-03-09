import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    const { amount, planName, isSubscription } = await req.json();
    const origin = new URL(req.url).origin;

    const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = isSubscription
      ? {
          currency: "gbp",
          product_data: { name: planName },
          unit_amount: amount * 100,
          recurring: { interval: "month" },
        }
      : {
          currency: "gbp",
          product_data: { name: planName },
          unit_amount: amount * 100,
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: priceData, quantity: 1 }],
      mode: isSubscription ? "subscription" : "payment",
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
