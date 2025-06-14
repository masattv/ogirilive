import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                大喜利<span className="text-pink-500">ライブ</span>
              </span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link
              href="/ogiri"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              お題一覧
            </Link>
            <Link
              href="/ogiri/new"
              className="bg-pink-600 text-white hover:bg-pink-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              お題を作る
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 