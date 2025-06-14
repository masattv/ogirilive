'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

interface AnswerFormProps {
  topicId: string;
  onSubmitted?: () => void;
  onSubmitWithAI?: (answer: string, userName: string) => Promise<void>;
}

export default function AnswerForm({ topicId, onSubmitted, onSubmitWithAI }: AnswerFormProps) {
  const [answer, setAnswer] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (onSubmitWithAI) {
        await onSubmitWithAI(answer, userName);
      } else {
        // 通常の投稿
        const { error: submitError } = await supabase
          .from('ogiri_answers')
          .insert([
            {
              topic_id: topicId,
              content: answer,
              user_name: userName,
            },
          ]);
        if (submitError) throw submitError;
      }
      setAnswer('');
      setUserName('');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError('回答の投稿に失敗しました。もう一度お試しください。');
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">回答を投稿</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="お名前"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          fullWidth
          placeholder=""
        />
        <Input
          label="回答"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          fullWidth
          placeholder="あなたの回答を入力してください"
        />
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          fullWidth
        >
          回答を投稿
        </Button>
      </form>
    </div>
  );
} 