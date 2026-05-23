import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = stripeSecret ? new Stripe(stripeSecret, {
  apiVersion: '2025-01-27.acacia' as any,
}) : null;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe Webhooks não estão configurados." }, { status: 400 });
  }

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Obter os IDs customizados guardados na Sessão de Checkout
        const spaceId = session.metadata?.spaceId;
        const subscriptionId = session.subscription as string;

        console.log(`✅ Faturação Concluída para Space: ${spaceId}. Subscrição: ${subscriptionId}`);

        if (spaceId && supabase) {
           // Gravar na Base de Dados que a Subscrição está ativa
           await supabase
             .from('spaces')
             .update({ stripe_subscription_id: subscriptionId, plan_type: 'home_premium' })
             .eq('id', spaceId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`❌ Subscrição Cancelada: ${subscription.id}`);
        
        if (supabase) {
           // Revogar o plano Premium do Space
           await supabase
             .from('spaces')
             .update({ plan_type: 'free' })
             .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }
      
      // Futuro: invoice.payment_failed, invoice.paid, etc...
      default:
        console.log(`Evento ignorado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error handling webhook event:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
