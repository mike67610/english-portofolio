import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET /api/content
// Returns all rows as { key: value, ... }
export async function GET() {
  const { data, error } = await supabase
    .from('portfolio_content')
    .select('key, value');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const content = {};
  data.forEach(({ key, value }) => {
    content[key] = value;
  });

  return NextResponse.json(content);
}

// PUT /api/content
// Body: { fields: { 'diary-content': '...', 'blog1-title': '...', ... } }
// Upserts every field into the database
export async function PUT(request) {
  const { fields } = await request.json();

  const rows = Object.entries(fields).map(([key, value]) => ({ key, value }));

  const { error } = await supabase
    .from('portfolio_content')
    .upsert(rows, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

