import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export default function Home() {
  const articles = getAllArticles();
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">IA Lucide</h1>
      <p className="text-gray-500 mb-10">L'IA sans illusions</p>
      <div className="space-y-8">
        {articles.map((a: any) => (
          <article key={a.slug}>
            <Link href={`/article/${a.slug}`}>
              <h2 className="text-xl font-semibold hover:underline">{a.title}</h2>
            </Link>
            <p className="text-gray-600 mt-1">{a.excerpt}</p>
            <span className="text-sm text-gray-400">{a.tag} · {a.read_time}</span>
          </article>
        ))}
      </div>
    </main>
  );
}
