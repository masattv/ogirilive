import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answer } = await req.json();

  // OpenAI API呼び出し
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI APIキーが設定されていません' }, { status: 500 });
  }

  const prompt = `以下の大喜利回答に対して、100点満点で点数（数値のみ）と、短いコメント（日本語）をJSON形式で返してください。\n\n回答: ${answer}\n\n出力例: {\"ai_score\": 80, \"ai_feedback\": \"面白い発想ですが、もう少しひねりが欲しいです。\"}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'あなたは大喜利の審査員です。' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';

  // JSONパース（安全のためtry-catch）
  let ai_score = null;
  let ai_feedback = '';
  try {
    const result = JSON.parse(text);
    ai_score = result.ai_score;
    ai_feedback = result.ai_feedback;
  } catch {
    ai_score = null;
    ai_feedback = 'AI判定の取得に失敗しました。';
  }

  return NextResponse.json({ ai_score, ai_feedback });
} 