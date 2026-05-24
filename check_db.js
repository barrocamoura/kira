require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDb() {
  const { data: users, error: err1 } = await supabase.from('users').select('*');
  console.log('--- USERS ---');
  console.log(users || err1);

  const { data: tickets, error: err2 } = await supabase.from('tickets').select('*');
  console.log('--- TICKETS ---');
  console.log(tickets || err2);

  const { data: kiosk, error: err3 } = await supabase.from('kiosk_settings').select('*');
  console.log('--- KIOSK SETTINGS ---');
  console.log(kiosk || err3);
}

checkDb();
