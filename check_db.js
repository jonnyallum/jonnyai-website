const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lkwydqtfbdjhxaarelaz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24'
);

async function check() {
  const { data, error } = await supabase
    .from('chatroom')
    .select('created_at, agent_id, ai_source, message')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error:', error);
  } else {
    require('fs').writeFileSync('output.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('Saved to output.json');
  }
}

check();
