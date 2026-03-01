import client from './client';

export const collectionApi = {
  // GET /api/collections
  getCollections: () => client('/collections'),

  // POST /api/collections
  createCollection: (data) => client('/collections', { body: data }),

  // DELETE /api/collections/{id}
  deleteCollection: (id) => client(`/collections/${id}`, { method: 'DELETE' }),
};