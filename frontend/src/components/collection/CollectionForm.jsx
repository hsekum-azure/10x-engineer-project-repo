import { useState, useEffect } from 'react';
import { collectionApi } from '../../api/collections';
import Button from '../shared/Button';

export default function CollectionForm({ onSave, initialData = null }) {
  const [formData, setFormData] = useState({ 
    name: initialData?.name || '', 
    description: initialData?.description || '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name, description: initialData.description || '' });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        // You'll need to implement updateCollection in your api/collections.js
        // await collectionApi.updateCollection(initialData.id, formData);
        alert("Update functionality requires a PUT endpoint in the backend/API layer.");
      } else {
        await collectionApi.createCollection(formData);
      }
      onSave();
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Collection Name</label>
        <input
          required
          type="text"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : (initialData ? 'Update Collection' : 'Create Collection')}
        </Button>
      </div>
    </form>
  );
}