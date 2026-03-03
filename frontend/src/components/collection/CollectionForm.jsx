import { useState, useEffect } from 'react';
import { collectionApi } from '../../api/collections';
import Button from '../shared/Button';

export default function CollectionForm({ onSave, initialData = null }) {
  const [formData, setFormData] = useState({ 
    name: initialData?.name || '', 
    description: initialData?.description || '' 
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // New: Validation state

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        name: initialData.name, 
        description: initialData.description || '' 
      });
    }
  }, [initialData]);

  // Validation Logic
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Collection name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check validation before proceeding
    if (!validate()) return;

    setLoading(true);

    try {
      if (initialData?.id) {
        // Update existing collection
        await collectionApi.updateCollection(initialData.id, formData);
      } else {
        // Create new collection
        await collectionApi.createCollection(formData);
      }
      onSave();
    } catch (err) {
      setErrors({ api: "Failed to save collection: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Collection Name Input */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Collection Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Marketing Prompts"
          className={`w-full p-2 border rounded-lg outline-none focus:ring-2 transition-all ${
            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
          }`}
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: null }); // Clear error on type
          }}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>
        )}
      </div>

      {/* Description Area */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Description
        </label>
        <textarea
          placeholder="What kind of prompts live here?"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* API Error Feedback */}
      {errors.api && (
        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
          {errors.api}
        </p>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (initialData ? 'Update Collection' : 'Create Collection')}
        </Button>
      </div>
    </form>
  );
}