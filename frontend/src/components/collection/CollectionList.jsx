export default function CollectionList({ collections, onDelete, onEdit }) {
  return (
    <div className="space-y-2">
      {collections.map((col) => (
        <div 
          key={col.id} 
          className="group p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition-all relative"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-800">{col.name}</h4>
              <p className="text-xs text-gray-500">{col.description || 'No description'}</p>
            </div>
            
            {/* Action Buttons on Hover */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(col)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Edit Collection"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete(col.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
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