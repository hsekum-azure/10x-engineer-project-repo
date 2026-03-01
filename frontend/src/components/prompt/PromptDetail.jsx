export default function PromptDetail({ prompt }) {
  if (!prompt) return null;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-extrabold text-gray-900">{prompt.title}</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">Edit</button>
          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
        </div>
      </div>
      
      <div className="flex gap-2">
        {prompt.tags?.map(tag => (
          <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#{tag}</span>
        ))}
      </div>

      <div className="bg-gray-900 text-gray-100 p-6 rounded-2xl font-mono whitespace-pre-wrap relative">
        <button className="absolute top-4 right-4 text-xs bg-gray-700 px-2 py-1 rounded">Copy</button>
        {prompt.content}
      </div>
    </div>
  );
}