import Button from '../shared/Button';

// Utility to wrap matching text in a highlight span
const highlightText = (text, query) => {
  // TRACE 1: Check inputs for the utility
  if (!query || !query.trim() || !text) {
    return text;
  }

  try {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) => {
          const isMatch = part.toLowerCase() === query.toLowerCase();
          return isMatch ? (
            <span 
              key={i} 
              className="bg-yellow-300 text-black font-bold rounded-sm px-0.5"
              style={{ display: 'inline', backgroundColor: '#fde047', color: 'black' }}
            >
              {part}
            </span>
          ) : (
            part
          );
        })}
      </span>
    );
  } catch (e) {
    console.error("Highlighting error:", e);
    return text;
  }
};

export default function PromptCard({ prompt, collections = [], onDelete, onEdit, onView, searchQuery = "" }) {

  // Find the collection name based on the prompt's collection_id
  const collectionName = collections.find(c => c.id === prompt.collection_id)?.name;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onView(prompt);
    }
  };

  return (
    <div 
      onClick={() => onView(prompt)}
      onKeyDown={handleKeyDown}
      tabIndex="0"
      role="button"
      className="group p-5 border border-gray-200 rounded-xl bg-white relative cursor-pointer transition-all
                 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 transition-all duration-200
                      opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 z-10">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onEdit(prompt); 
          }}
          onKeyDown={(e) => e.stopPropagation()}
          className="p-2 bg-gray-100 md:bg-white text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-200 md:border-gray-100 shadow-sm transition-colors"
          title="Edit"
        >
          ✏️
        </button>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(prompt.id); 
          }}
          onKeyDown={(e) => e.stopPropagation()}
          className="p-2 bg-gray-100 md:bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 md:border-gray-100 shadow-sm transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* Collection Badge */}
      {collectionName && (
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1.5 block">
          {collectionName}
        </span>
      )}

      {/* Highlighted Title */}
      <h3 className="font-bold text-lg text-gray-900 mb-1 pr-16 truncate">
        {highlightText(prompt.title, searchQuery)}
      </h3>
      
      {/* Highlighted Description */}
      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
        {highlightText(prompt.description || 'No description provided.', searchQuery)}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {prompt.tags?.map(tag => (
          <span 
            key={tag} 
            className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100 font-medium"
          >
            #{highlightText(tag, searchQuery)}
          </span>
        ))}
      </div>
    </div>
  );
}