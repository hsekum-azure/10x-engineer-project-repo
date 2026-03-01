const BASE_URL = '/api';

async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // 204 No Content (usually from DELETE) returns nothing
    if (response.status === 204) return null;

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    // Handle FastAPI/Pydantic error messages
    throw new Error(data.detail || response.statusText);
  } catch (err) {
    return Promise.reject(err.message || 'Network Error');
  }
}

export default client;