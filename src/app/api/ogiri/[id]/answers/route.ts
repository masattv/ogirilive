import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { content, isAnonymous, user_name } = body;

    if (!content || !user_name) {
      return NextResponse.json({ error: '内容・名前は必須です' }, { status: 400 });
    }

    // 回答追加
    const { data, error } = await supabaseServer
      .from('ogiri_answers')
      .insert({
        topic_id: params.id,
        user_id: null,
        user_name,
        content,
        is_anonymous: isAnonymous || false,
        status: 'active',
        ai_score: null,
        ai_feedback: null,
      })
      .select()
      .single();

    if (error) throw error;

    // 回答数をインクリメント
    const { data: topic, error: topicError } = await supabaseServer
      .from('ogiri_topics')
      .select('answer_count')
      .eq('id', params.id)
      .single();

    if (!topicError && topic) {
      await supabaseServer
        .from('ogiri_topics')
        .update({ answer_count: (topic.answer_count || 0) + 1 })
        .eq('id', params.id);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '回答の作成に失敗しました' }, { status: 500 });
  }
} 