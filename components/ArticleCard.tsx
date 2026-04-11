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
      <article className="bg-white shadow-[0_2px_32px_rgba(28,28,23,0.04)] hover:shadow-[0_4px_32px_rgba(28,28,23,0.08)] hover:border-t-2 hover:border-t-[#c9a84c] transition-all duration-500 hover:-translate-y-1">
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
            <div className="w-full h-full bg-gradient-to-br from-[#1a3a4a] to-[#1c1c17] group-hover:scale-105 transition-transform duration-700" />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#1c1c17]/25 group-hover:bg-[#1c1c17]/10 transition-all duration-500" />
          {/* Tag — Label-MD */}
          <div className="absolute top-4 left-4">
            <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase px-3 py-1.5 bg-[#1c1c17]/80 text-[#c9a84c] border border-[#c9a84c]/30">
              {tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 space-y-3">
          {/* Title — Title-LG: 1.375rem 700 */}
          <h3 className="text-[1.375rem] font-bold leading-snug text-[#1c1c17] group-hover:text-[#c9a84c] transition-colors duration-300" style={{ letterSpacing: '-0.02em' }}>
            {title}
          </h3>
          {/* Body-LG: 1rem 400 line-height 1.6 */}
          <p className="text-base text-[#6b6b6b] leading-relaxed line-clamp-2">
            {excerpt}
          </p>
          {/* Label-MD metadata */}
          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-xs font-bold tracking-[0.05em] uppercase text-[#6b6b6b]">
              {author || 'Rédaction'}
            </span>
            {read_time && (
              <span className="font-mono text-xs text-[#6b6b6b]">
                {read_time} min
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
