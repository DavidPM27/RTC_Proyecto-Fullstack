const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE}/users/login`, {
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

  const res = await fetch(`${BASE}/users/register`, {
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
  const res = await fetch(`${BASE}/users/${id}`, {
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

export const getAllUsers = async (token) => {
  const res = await fetch(`${BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error fetching users');
  }

  return data;
};

export const changeUserRole = async (id, role, token) => {
  const res = await fetch(`${BASE}/users/changeRole/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error changing user role');
  }

  return data;
};

export const getUser = async (id) => {
  const res = await fetch(`${BASE}/users/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data || 'Error fetching user');
  }
  return data;
};

export const deleteUser = async (id, token) => {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error deleting account');
  }

  return data;
};

export const resetPassword = async (email, currentPassword, newPassword) => {
  const res = await fetch(`${BASE}/users/reset-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, currentPassword, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data || 'Error resetting password');
  }

  return data;
};
