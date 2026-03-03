import { useState, useEffect } from 'react';
import { promptApi } from '../../api/prompts';
import Button from '../shared/Button';

export default function PromptForm({ onSave, collections = [], initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    description: initialData?.description || '',
    collection_id: initialData?.collection_id || '',
    tags: initialData?.tags ? initialData.tags.join(', ') : ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // New: Validation state

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

  // Validation Logic
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check validation before proceeding
    if (!validate()) return;

    setLoading(true);
    
    const payload = {
      ...formData,
      tags: formData.tags 
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== '') 
        : []
    };

    try {
      if (initialData?.id) {
        await promptApi.updatePrompt(initialData.id, payload);
      } else {
        await promptApi.createPrompt(payload);
      }
      onSave(); 
    } catch (err) {
      setErrors({ api: "Failed to save: " + err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <input 
          className={`w-full p-2 border rounded-lg outline-none focus:ring-2 transition-all ${
            errors.title ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'
          }`}
          placeholder="Prompt Title"
          value={formData.title}
          onChange={(e) => {
            setFormData({...formData, title: e.target.value});
            if (errors.title) setErrors({...errors, title: null}); // Clear error on type
          }}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors.title}</p>}
      </div>
      
      {/* Content Area */}
      <div>
        <textarea 
          className={`w-full p-2 border rounded-lg h-32 outline-none focus:ring-2 transition-all ${
            errors.content ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'
          }`}
          placeholder="Prompt Content"
          value={formData.content}
          onChange={(e) => {
            setFormData({...formData, content: e.target.value});
            if (errors.content) setErrors({...errors, content: null}); // Clear error on type
          }}
        />
        {errors.content && <p className="text-red-500 text-xs mt-1 font-medium">{errors.content}</p>}
      </div>

      {/* Description Area */}
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
      
      {/* API Error Feedback */}
      {errors.api && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{errors.api}</p>}

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