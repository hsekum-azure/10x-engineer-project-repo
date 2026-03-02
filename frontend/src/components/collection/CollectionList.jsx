export default function CollectionList({ collections, onDelete, onEdit }) {
  return (
    /* Changed space-y-2 to the grid system used in PromptList */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((col) => (
        <div 
          key={col.id} 
          className="group p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition-all relative h-fit"
        >
          <div className="flex justify-between items-start">
            <div className="pr-8"> {/* Added padding-right to prevent text overlapping buttons */}
              <h4 className="font-bold text-gray-800">{col.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{col.description || 'No description'}</p>
            </div>
            
            {/* Action Buttons on Hover */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(col)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit Collection"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete(col.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Collection"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}