import Link from 'next/link';
import Image from 'next/image';

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  author: string;
  read_time: string;
  date?: string;
  image_url?: string;
  featured?: boolean;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  tag,
  author,
  read_time,
  image_url,
}: ArticleCardProps) {
  return (
    <Link href={`/article/${slug}`} className="group block">
      <article className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:border-t-2 hover:border-t-[#c9a84c] transition-all duration-500 hover:-translate-y-1">
        {/* Image / placeholder */}
        <div className="relative overflow-hidden" style={{ height: '220px' }}>
          {image_url ? (
            <Image
              src={image_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a3a4a] to-[#0e0e0e] group-hover:scale-105 transition-transform duration-700" />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#0e0e0e]/25 group-hover:bg-[#0e0e0e]/10 transition-all duration-500" />
          {/* Tag */}
          <div className="absolute top-4 left-4">
            <span
              className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-[#0e0e0e]/80 text-[#c9a84c] border border-[#c9a84c]/30"
            >
              {tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 space-y-3">
          <h3
            className="text-lg md:text-xl font-semibold text-[#0e0e0e] leading-tight group-hover:text-[#c9a84c] transition-colors duration-300"
          >
            {title}
          </h3>
          <p
            className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-2"
          >
            {excerpt}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span
              className="text-[10px] tracking-wider text-[#6b6b6b] uppercase"
            >
              {author || 'Rédaction'}
            </span>
            {read_time && (
              <span
                className="text-[10px] tracking-wider text-[#6b6b6b]"
              >
                {read_time} min
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
