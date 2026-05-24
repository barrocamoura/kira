import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe gracefully to avoid crashing if keys are missing
const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, {
  apiVersion: '2025-01-27.acacia' as any,
}) : null;

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'A configuração do Stripe (STRIPE_SECRET_KEY) não está definida no .env.local' },
        { status: 500 }
      );
    }

    const { plan, userId, spaceId } = await request.json();

    // Utilizar os IDs reais configurados no .env
    let priceId = process.env.STRIPE_PRICE_HOME || "price_mock_aura_home"; 
    
    // We can also accept an arbitrary price or look it up based on 'plan'
    if (plan === 'enterprise') {
      priceId = process.env.STRIPE_PRICE_ENTERPRISE || "price_mock_aura_enterprise";
    }

    // Criar a Sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId, // Requires creating a Product and Price in Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/?payment=cancelled`,
      metadata: {
        userId: userId || 'anonymous',
        spaceId: spaceId || 'new_space',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
