import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { data: topic, error: topicError } = await supabaseServer
    .from('ogiri_topics')
    .select('*')
    .eq('id', params.id)
    .single();

  if (topicError || !topic) {
    return NextResponse.json({ error: 'お題が見つかりません' }, { status: 404 });
  }

  const { data: answers, error: answersError } = await supabaseServer
    .from('ogiri_answers')
    .select('*')
    .eq('topic_id', params.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (answersError) {
    return NextResponse.json({ error: '回答取得失敗' }, { status: 500 });
  }

  return NextResponse.json({ ...topic, answers: answers || [] });
} 