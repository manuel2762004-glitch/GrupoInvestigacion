const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDB() {
  const [
    { data: projects, error: errProj },
    { data: publications, error: errPub },
    { data: lines, error: errLines }
  ] = await Promise.all([
    supabase.from('proyectos').select('*'),
    supabase.from('publicaciones').select('*'),
    supabase.from('lineas_investigacion').select('*')
  ]);

  console.log("--- PROJECTS ---");
  console.log(JSON.stringify(projects, null, 2));
  console.log("--- PUBLICATIONS ---");
  console.log(JSON.stringify(publications, null, 2));
  console.log("--- RESEARCH LINES ---");
  console.log(JSON.stringify(lines, null, 2));
}

checkDB();
