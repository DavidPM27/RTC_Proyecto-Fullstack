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

export const registerUser = async ({ username, email, password, imageFile }) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const res = await fetch('/api/users/register', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error registering user');
  }

  return data;
};

export const updateUserProfile = async (id, formData, token) => {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error updating profile');
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
