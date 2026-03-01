export default function PromptCard({ prompt }) {
  // Matches Python: title, description, tags, created_at
  return (
    <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white">
      <h3 className="font-bold text-lg text-gray-900 mb-1">{prompt.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{prompt.description}</p>
      <div className="flex flex-wrap gap-2">
        {prompt.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full uppercase font-semibold">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}