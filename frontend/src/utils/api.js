const API_BASE = 'http://localhost:5000/api/auth';

export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// export const loginUser = async (data) => {
//   const res = await fetch(`${API_BASE}/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// };
// In your api.js or similar
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  // If the response body is empty, don't attempt to parse as JSON
  const text = await response.text();
  if (!text) {
    return { message: 'No response from server' };
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return { message: 'Invalid JSON response from server' };
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    return { message: 'Network error' };
  }
};


export const resetPassword = async (data) => {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
