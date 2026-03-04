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

    // --- NEW LOGIC: Prevent 'Unexpected end of JSON' ---
    let data = null;
    const contentType = response.headers.get("content-type");
    
    // Only try to parse if the server actually sent JSON
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (response.ok) {
      return data;
    }

    // Handle FastAPI/Pydantic error messages or fallback to status text
    const errorMessage = data?.detail || response.statusText || `Error: ${response.status}`;
    throw new Error(errorMessage);

  } catch (err) {
    // If it's a real network failure (server is down), 'err' is usually a TypeError
    const friendlyMessage = err.name === 'TypeError' 
      ? 'Connection failed. Please check if the server is running.' 
      : err.message;
      
    return Promise.reject(friendlyMessage || 'Network Error');
  }
}

export default client;