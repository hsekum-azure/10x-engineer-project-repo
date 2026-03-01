export default function CollectionForm({ onSubmit }) {
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); /* Logic later */ }}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Collection Name</label>
        <input type="text" className="w-full mt-1 p-2 border rounded-md" placeholder="e.g., Marketing Scripts" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea className="w-full mt-1 p-2 border rounded-md" rows="3"></textarea>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Create Collection</button>
    </form>
  );
}