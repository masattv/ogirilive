import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">大喜利ライブへようこそ！</h1>
      <Link href="/ogiri" className="text-pink-400 underline">お題一覧へ</Link>
    </main>
  );
} 