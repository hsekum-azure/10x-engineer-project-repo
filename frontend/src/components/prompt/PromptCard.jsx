import Button from '../shared/Button';

export default function PromptCard({ prompt, onDelete, onEdit }) {
  return (
    <div className="group p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white relative">
      {/* Action Buttons - Visible on Hover or mobile */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(prompt)}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          title="Edit"
        >
          ✏️
        </button>
        <button 
          onClick={() => onDelete(prompt.id)}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-1 pr-12">{prompt.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{prompt.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {prompt.tags?.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}