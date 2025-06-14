import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiKey || !supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'APIキーまたはSupabase情報が不足しています' }, { status: 500 });
  }

  // より大喜利らしいお題生成プロンプト
  const prompt = `日本語で、ユーモアや発想力を問う「大喜利」らしいお題を5個、JSON配列で生成してください。各お題はtitle（短いタイトル）とdescription（説明）の2つのプロパティを持つオブジェクトで返してください。お題例：「こんな○○は嫌だ」「もし○○が○○だったら」「○○の新しい使い方」など。descriptionには回答者がボケやすいような説明を入れてください。例: [{"title": "こんな校長先生は嫌だ", "description": "どんな校長先生？"}, ...]`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'あなたは日本語の大喜利お題職人です。' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content || '';
  // コードブロックを除去
  text = text.replace(/```json|```/g, '').trim();

  let topics: { title: string; description: string }[] = [];
  try {
    topics = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'AIからの出力のパースに失敗しました', raw: text }, { status: 500 });
  }

  // Supabaseに保存
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from('ogiri_topics').insert(
    topics.map((t) => ({
      title: t.title,
      description: t.description,
      content: t.title,
      category: "AI",
      view_count: 0,
      answer_count: 0,
      is_ai_generated: true,
      status: 'active',
    }))
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ topics });
} 