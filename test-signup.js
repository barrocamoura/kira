require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test-diagnostic@example.com',
    password: 'password123',
    options: {
      data: { full_name: 'Test User' }
    }
  });
  console.log("Error:", error?.message);
}
test();
