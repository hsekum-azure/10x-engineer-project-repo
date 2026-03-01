import { useState, useEffect } from 'react';
import { promptApi } from '../../api/prompts';
import Button from '../shared/Button';

export default function PromptForm({ onSave, collections = [], initialData = null }) {
  // 1. Initialize state. If initialData exists, we use it.
  // Note: For tags, we join the array into a comma-separated string for the input.
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    description: initialData?.description || '',
    collection_id: initialData?.collection_id || '',
    tags: initialData?.tags ? initialData.tags.join(', ') : ''
  });

  const [loading, setLoading] = useState(false);

  // 2. If initialData changes (e.g., user clicks a different edit button), update the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        description: initialData.description || '',
        collection_id: initialData.collection_id || '',
        tags: initialData.tags ? initialData.tags.join(', ') : ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Formatting tags back into a List[str] for your Python backend
    const payload = {
      ...formData,
      tags: formData.tags 
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== '') 
        : []
    };

    try {
      if (initialData?.id) {
        // Update existing prompt (PUT or PATCH)
        await promptApi.updatePrompt(initialData.id, payload);
      } else {
        // Create new prompt
        await promptApi.createPrompt(payload);
      }
      onSave(); // Refresh list and close modal in App.jsx
    } catch (err) {
      alert("Failed to save prompt: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <input 
        required
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Prompt Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      
      {/* Content Area */}
      <textarea 
        required
        className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Prompt Content"
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
      />

      {/* Description Area (New) */}
      <input 
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Brief Description (Optional)"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />

      {/* Collections Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Collection
        </label>
        <select 
          className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          value={formData.collection_id}
          onChange={(e) => setFormData({...formData, collection_id: e.target.value})}
        >
          <option value="">None (Global Prompt)</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Input */}
      <input 
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Tags (comma separated: coding, python)"
        value={formData.tags}
        onChange={(e) => setFormData({...formData, tags: e.target.value})}
      />
      
      {/* Submit Button */}
      <div className="pt-2">
        <Button 
            type="submit" 
            variant="primary"
            className="w-full"
            disabled={loading}
        >
            {loading ? 'Saving...' : (initialData ? 'Update Prompt' : 'Create Prompt')}
        </Button>
      </div>
    </form>
  );
}