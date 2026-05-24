require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDb() {
  const { data: tickets, error: err2 } = await supabase
      .from('tickets')
      .select('*, author:users(full_name), ticket_messages(message, created_at, user_id, author:users(full_name))')
      .order('created_at', { ascending: false });
      
  console.log('--- NEW TICKETS QUERY NO HINTS ---');
  console.log("Error:", err2);
  console.log("Data length:", tickets ? tickets.length : null);
}

checkDb();
