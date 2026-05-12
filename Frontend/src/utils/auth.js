const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
};

export const isAdmin = () => getCurrentUser()?.role === 'admin';
