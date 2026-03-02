export default function PromptDetail({ prompt, collections = [], onEdit, onDelete }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    alert("Prompt copied to clipboard!");
  };

  if (!prompt) return null;

  // Look up the collection name from the ID
  const collection = collections.find(c => c.id === prompt.collection_id);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{prompt.title}</h2>
          <p className="text-gray-500 mt-1">{prompt.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(prompt)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">✏️ Edit</button>
          <button onClick={() => onDelete(prompt.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️ Delete</button>
        </div>
      </div>
      
      {/* Tags Section */}
      <div className="flex flex-wrap gap-2">
        {prompt.tags?.map(tag => (
          <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">#{tag}</span>
        ))}
      </div>

      {/* Main Content (Code Block) */}
      <div className="group relative">
        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Prompt Content</label>
        <div className="bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm whitespace-pre-wrap leading-relaxed shadow-inner border border-gray-800">
          {prompt.content}
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
          >
            📋 Copy
          </button>
        </div>
      </div>

      {/* --- Collection Section (Now Below Content) --- */}
      <div className="pt-4 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-widest">Organized In</label>
        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-xl">📁</span>
          <span className="font-semibold">
            {collection ? collection.name : 'Global / No Collection'}
          </span>
          {collection?.description && (
            <span className="text-gray-400 text-sm italic">— {collection.description}</span>
          )}
        </div>
      </div>
    </div>
  );
}