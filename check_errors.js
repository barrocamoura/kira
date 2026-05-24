require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDb() {
  const { data: users, error: err1 } = await supabase
      .from('users')
      .select('*, spaces(id, name, plan_type)');
  console.log('--- USERS FETCH ERROR ---');
  console.log(err1);

  const { data: tickets, error: err2 } = await supabase
      .from('tickets')
      .select('*, user:users(full_name, email), ticket_messages(message, created_at, sender_id, sender:users(full_name))');
  console.log('--- TICKETS FETCH ERROR ---');
  console.log(err2);
}

checkDb();
