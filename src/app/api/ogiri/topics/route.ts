import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const { data: topics, error } = await supabaseServer
    .from('ogiri_topics')
    .select('id, content, category, created_by, is_ai_generated, status, view_count, answer_count, tags, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(topics || []);
} 