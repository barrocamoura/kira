const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read env local manually
const envFile = fs.readFileSync('../brunswick-pt/.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val) env[key.trim()] = val.join('=').trim().replace(/"/g, '');
});

const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
    const { data } = await supabase.from('operadores').select('id, nome_operador, email_acesso, permissoes_modulos, nivel_permissao').ilike('nome_operador', '%fatima%');
    console.log(JSON.stringify(data, null, 2));
}

run();
