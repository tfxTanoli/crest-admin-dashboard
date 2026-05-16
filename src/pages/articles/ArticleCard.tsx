import type { Article, ContentBlock } from '../../data/articles'

function renderBlock(block: ContentBlock, i: number) {
  if (block.type === 'heading') {
    return (
      <h3
        key={i}
        className="text-lg font-bold text-white mt-8 mb-3 pb-2 border-b border-gray-800"
      >
        {block.text}
      </h3>
    )
  }
  if (block.type === 'list') {
    return (
      <ul key={i} className="space-y-2 my-3 pl-1">
        {block.items.map((item, j) => (
          <li key={j} className="flex items-start gap-3 text-gray-300 text-[15px] leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <p key={i} className="text-gray-300 text-[15px] leading-relaxed my-3">
      {block.text}
    </p>
  )
}

interface Props {
  article: Article
}

export default function ArticleCard({ article }: Props) {
  return (
    <article
      id={`article-${article.id}`}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
    >
      {/* Image */}
      {article.image && (
        <div className="w-full bg-gray-800/60 flex items-center justify-center px-6 pt-8 pb-4">
          <img
            src={article.image}
            alt={article.imageAlt ?? article.title}
            className="max-h-[480px] w-auto max-w-full object-contain rounded-xl shadow-lg"
          />
        </div>
      )}

      <div className="p-6 sm:p-8 md:p-10">
        {/* Article number badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {article.id}
          </div>
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">
            Article {article.id} of 6
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
          {article.title}
        </h2>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="text-brand-300 text-base font-medium leading-relaxed mb-6 pb-6 border-b border-gray-800">
            {article.subtitle}
          </p>
        )}

        {/* Content */}
        <div className="mt-2">
          {article.content.map((block, i) => renderBlock(block, i))}
        </div>
      </div>
    </article>
  )
}
