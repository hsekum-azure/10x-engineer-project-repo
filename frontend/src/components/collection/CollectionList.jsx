export default function CollectionList({ collections, promptCounts = {}, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((col) => {
        // Look up the count for this specific collection ID
        const count = promptCounts[col.id] || 0;

        return (
          <div 
            key={col.id} 
            className="group p-5 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all relative h-fit"
          >
            <div className="flex justify-between items-start">
              <div className="pr-16"> 
                <h4 className="font-bold text-gray-900 text-lg">{col.name}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                  {col.description || 'No description provided for this collection.'}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
                <button 
                  onClick={() => onEdit(col)}
                  className="p-2 bg-white md:bg-transparent border border-gray-200 md:border-none text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm md:shadow-none"
                  title="Edit Collection"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDelete(col.id)}
                  className="p-2 bg-white md:bg-transparent border border-gray-200 md:border-none text-red-600 hover:bg-red-50 rounded-lg shadow-sm md:shadow-none"
                  title="Delete Collection"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {/* Visual indicator for a collection footer + STATISTIC */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📂</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Folder
                </span>
              </div>

              {/* NEW: Prompt Count Badge */}
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 uppercase tracking-tight">
                {count} {count === 1 ? 'Prompt' : 'Prompts'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}