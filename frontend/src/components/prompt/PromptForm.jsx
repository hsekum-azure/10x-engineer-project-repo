export default function PromptForm() {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200">
      <div className="grid grid-cols-1 gap-4">
        <input 
          type="text" 
          placeholder="Prompt Title" 
          className="text-2xl font-bold border-none outline-none focus:ring-0 placeholder:text-gray-300" 
        />
        <textarea 
          placeholder="The main content of the prompt..." 
          className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:bg-white transition-all"
        />
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <input type="text" placeholder="Short description (Optional)" className="w-full p-2 border rounded-md text-sm" />
        <input type="text" placeholder="Tags (comma separated: coding, python)" className="w-full p-2 border rounded-md text-sm" />
        <select className="w-full p-2 border rounded-md text-sm bg-white">
          <option value="">Select Collection (Optional)</option>
        </select>
      </div>
    </div>
  );
}