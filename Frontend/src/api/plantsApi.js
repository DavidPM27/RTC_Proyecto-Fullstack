const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

export const fetchPlants = async () => {
  const res = await fetch(`${BASE}/plants`);
  if (!res.ok) throw new Error('Failed to fetch plants');
  return res.json();
};

export const fetchPlantById = async (id) => {
  const res = await fetch(`${BASE}/plants/${id}`);
  if (!res.ok) throw new Error('Failed to fetch plant');
  return res.json();
};

export const fetchUserGarden = async (token) => {
  const res = await fetch(`${BASE}/users/me/garden`, {
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user garden');
  return res.json();
};

export const addPlantToUserGarden = async (plantId, token) => {
  const res = await fetch(`${BASE}/plants/${plantId}/addToUser`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || 'Failed to add plant to garden');
    err.status = res.status;
    throw err;
  }
  return res.json();
};

export const removeUserGardenPlant = async (entryId, token) => {
  const res = await fetch(`${BASE}/users/me/garden/${entryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to remove plant from garden');
  return res.json();
};

export const waterUserGardenPlant = async (entryId, token) => {
  const res = await fetch(`${BASE}/users/me/garden/${entryId}/water`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to update watering');
  return res.json();
};

export const updatePlantInCatalog = async (plantId, plantData, imageFile, token) => {
  const formData = new FormData();
  Object.entries(plantData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (imageFile) formData.append('image', imageFile);

  const res = await fetch(`${BASE}/plants/${plantId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token || getToken()}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update plant');
  }
  return res.json();
};

export const deletePlantFromCatalog = async (plantId, token) => {
  const res = await fetch(`${BASE}/plants/${plantId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to delete plant');
  return res.json();
};

export const addCustomPlantToGarden = async (formData, token) => {
  const res = await fetch(`${BASE}/users/me/garden/custom`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || getToken()}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to add custom plant');
  return res.json();
};
