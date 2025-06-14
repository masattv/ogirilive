'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AnswerForm from '@/components/features/ogiri/AnswerForm';
import AnswerList from '@/components/features/ogiri/AnswerList';
import { OgiriTopic, OgiriAnswer } from '@/types/ogiri';

export default function OgiriDetailPage() {
  // パスからidを抽出
  const pathname = usePathname();
  const match = pathname.match(/\/ogiri\/([0-9a-fA-F-]{36})/);
  const topicId = match ? match[1] : '';
  const supabase = createClientComponentClient();

  const [topic, setTopic] = useState<OgiriTopic | null>(null);
  const [answers, setAnswers] = useState<OgiriAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  // お題・回答の取得
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: topicData } = await supabase
      .from('ogiri_topics')
      .select('*')
      .eq('id', topicId)
      .single();
    setTopic(topicData);

    const { data: answersData } = await supabase
      .from('ogiri_answers')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });
    setAnswers(answersData || []);
    setLoading(false);
  }, [supabase, topicId]);

  // --- 閲覧数インクリメント ---
  useEffect(() => {
    if (!topicId) return;
    supabase.rpc('increment_view_count', { topic_id_input: topicId }).then(({ data, error }) => {
      fetchData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, topicId]);

  // 回答送信時のAI判定付き保存
  const handleAnswerSubmit = async (answer: string, userName: string) => {
    // OpenAI APIでAI判定
    const res = await fetch('/api/ogiri/ai-judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
    const { ai_score, ai_feedback } = await res.json();

    // Supabaseに保存
    await supabase.from('ogiri_answers').insert([
      {
        topic_id: topicId,
        content: answer,
        user_name: userName,
        ai_score,
        ai_feedback,
      },
    ]);
    // --- 回答数インクリメント ---
    await supabase.rpc('increment_answer_count', { topic_id_input: topicId });
    await fetchData(); // 最新のトピック・回答を再取得
  };

  if (loading) {
    return <div className="text-center text-gray-400">読み込み中...</div>;
  }
  if (!topic) {
    return <div className="text-center text-gray-400">お題が見つかりません。</div>;
  }

  return (
    <div className="space-y-8">
      {/* お題情報 */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">{topic.title}</h1>
        <p className="text-gray-300">{topic.description}</p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
          <span>回答数: {topic.answer_count || 0}</span>
        </div>
      </div>

      {/* 回答投稿フォーム */}
      <AnswerForm
        topicId={topicId}
        onSubmitted={fetchData}
        onSubmitWithAI={handleAnswerSubmit}
      />

      {/* 回答一覧 */}
      <AnswerList answers={answers} />
    </div>
  );
} 