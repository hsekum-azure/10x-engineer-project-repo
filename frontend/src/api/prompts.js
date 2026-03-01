import client from './client';

export const promptApi = {
  // GET /api/prompts
  getPrompts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return client(`/prompts?${query}`);
  },

  // GET /api/prompts/{id}
  getPrompt: (id) => client(`/prompts/${id}`),

  // POST /api/prompts
  createPrompt: (data) => client('/prompts', { body: data }),

  // PUT /api/prompts/{id}
  updatePrompt: (id, data) => client(`/prompts/${id}`, { method: 'PUT', body: data }),

  // PATCH /api/prompts/{id}
  patchPrompt: (id, data) => client(`/prompts/${id}`, { method: 'PATCH', body: data }),

  // DELETE /api/prompts/{id}
  deletePrompt: (id) => client(`/prompts/${id}`, { method: 'DELETE' }),
};