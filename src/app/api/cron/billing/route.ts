import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key' // Need service role to bypass RLS and update users
    );
    const today = new Date();
    
    // ==========================================
    // 1. TRIAL AUTOMATION (15 Days Rule)
    // ==========================================
    
    // Find all trial contracts
    const { data: trials } = await supabase
      .from('client_contracts')
      .select('*, user:users(email, full_name)')
      .eq('status', 'trial');

    if (trials) {
      for (const contract of trials) {
        const startDate = new Date(contract.start_date);
        const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

        // Day 12: Send Marketing Email to convert
        if (daysElapsed === 12) {
          await sendMarketingEmail(contract.user.email, contract.user.full_name);
        }

        // Day 16: Block automatically
        if (daysElapsed >= 16) {
          await blockUserAndContract(contract.id, contract.user_id, supabase);
          console.log(`Blocked user ${contract.user_id} due to trial expiration.`);
        }
      }
    }

    // ==========================================
    // 2. PAID PLANS AUTOMATION (Overdue Payments)
    // ==========================================
    
    // Find all active contracts
    const { data: activeContracts } = await supabase
      .from('client_contracts')
      .select('*, user:users(email, full_name)')
      .eq('status', 'active')
      .not('next_billing_date', 'is', null);

    if (activeContracts) {
      for (const contract of activeContracts) {
        const nextBilling = new Date(contract.next_billing_date);
        const daysOverdue = Math.floor((today.getTime() - nextBilling.getTime()) / (1000 * 3600 * 24));

        // Check if overdue by the 5-day tolerance
        if (daysOverdue === 1) {
          await sendOverdueWarningEmail(contract.user.email, contract.user.full_name);
        }

        if (daysOverdue > 5) {
          await blockUserAndContract(contract.id, contract.user_id, supabase);
          console.log(`Blocked user ${contract.user_id} due to overdue payment (> 5 days).`);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Billing cron executed successfully' });

  } catch (error: any) {
    console.error('CRON Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Helper Functions
async function blockUserAndContract(contractId: string, userId: string, supabase: any) {
  // Update Contract to Suspended
  await supabase.from('client_contracts').update({ status: 'suspended' }).eq('id', contractId);
  // Update User to Blocked
  await supabase.from('users').update({ status: 'blocked' }).eq('id', userId);
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Aura OS <vendas@sperosystems.com>',
      to: [to],
      subject,
      html
    })
  });
}

async function sendMarketingEmail(email: string, name: string) {
  const subject = "Faltam apenas 3 dias para o fim do teu Trial no Aura OS!";
  const html = `
    <h1>Olá ${name},</h1>
    <p>Esperamos que estejas a gostar de transformar a tua casa com o <strong>Aura OS</strong>.</p>
    <p>O teu período gratuito de 15 dias acaba em <strong>3 dias</strong>.</p>
    <p>Para não perderes o acesso ao motor 3D e às automações da Kira AI, atualiza para o plano Aura Home por apenas €19/mês.</p>
    <br/>
    <p>Acede já à plataforma para assinares o teu plano!</p>
  `;

  await sendResendEmail(email, subject, html);
}

async function sendOverdueWarningEmail(email: string, name: string) {
  const subject = "Aviso: Falha de Pagamento - Aura OS";
  const html = `
    <h1>Olá ${name},</h1>
    <p>Não conseguimos processar o pagamento da tua subscrição do <strong>Aura OS</strong>.</p>
    <p>Por favor atualiza o teu método de pagamento para evitares a interrupção do serviço em <strong>4 dias</strong>.</p>
  `;

  await sendResendEmail(email, subject, html);
}
