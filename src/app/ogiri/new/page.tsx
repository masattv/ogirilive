'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function NewOgiriPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('ogiri_topics')
        .insert([
          {
            title,
            description,
            view_count: 0,
            answer_count: 0,
          },
        ]);

      if (submitError) throw submitError;

      router.push('/ogiri');
      router.refresh();
    } catch (err) {
      setError('お題の作成に失敗しました。もう一度お試しください。');
      console.error('Error creating topic:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">新しいお題を作る</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            placeholder="お題のタイトルを入力してください"
          />
          
          <Input
            label="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            placeholder="お題の説明を入力してください"
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              お題を作成
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 