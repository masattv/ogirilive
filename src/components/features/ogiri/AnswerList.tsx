import { OgiriAnswer } from '@/types/ogiri';

interface AnswerListProps {
  answers: OgiriAnswer[];
}

export default function AnswerList({ answers }: AnswerListProps) {
  if (answers.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center text-gray-400">
        まだ回答がありません。最初の回答を投稿してみましょう！
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">回答一覧</h2>
      {answers.map((answer) => (
        <div key={answer.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white font-medium">{answer.user_name || '匿名'}</p>
              <p className="text-gray-300 mt-2">{answer.content}</p>
            </div>
            {answer.ai_score && (
              <div className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm">
                AI評価: {answer.ai_score}
              </div>
            )}
          </div>
          {answer.ai_feedback && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">{answer.ai_feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 