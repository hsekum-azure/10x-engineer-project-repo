export default function CollectionList({ collections }) {
  return (
    <div className="space-y-2">
      {collections.map((col) => (
        <div key={col.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm cursor-pointer transition-all">
          <h4 className="font-bold text-gray-800">{col.name}</h4>
          <p className="text-xs text-gray-500">{col.description || 'No description'}</p>
        </div>
      ))}
    </div>
  );
}