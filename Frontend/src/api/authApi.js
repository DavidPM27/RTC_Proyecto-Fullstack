export const loginUser = async (email, password) => {
  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error logging in');
  }

  return data; // JWT token
};

export const registerUser = async ({ username, email, password }) => {
  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error registering user');
  }

  return data;
};

export const resetPassword = async (email, newPassword) => {
  const res = await fetch('/api/users/reset-password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error resetting password');
  }

  return data;
};
