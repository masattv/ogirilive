import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OgiriTopic } from '@/types/ogiri';

export const dynamic = "force-dynamic";

export default async function OgiriListPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: topics } = await supabase
    .from('ogiri_topics')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">お題一覧</h1>
        <Link
          href="/ogiri/new"
          className="bg-pink-600 text-white hover:bg-pink-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          お題を作る
        </Link>
      </div>

      {!topics || topics.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center text-gray-400">
          まだお題がありません。最初のお題を作成してみましょう！
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic: OgiriTopic) => (
            <Link
              key={topic.id}
              href={`/ogiri/${topic.id}`}
              className="block"
            >
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-white mb-2">{topic.title}</h2>
                <p className="text-gray-300 mb-4 line-clamp-2">{topic.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>回答数: {topic.answer_count || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 