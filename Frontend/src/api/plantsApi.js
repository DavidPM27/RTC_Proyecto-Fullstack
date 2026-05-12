const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

export const fetchPlants = async () => {
  const res = await fetch('/api/plants');
  if (!res.ok) throw new Error('Failed to fetch plants');
  return res.json();
};

export const fetchPlantById = async (id) => {
  const res = await fetch(`/api/plants/${id}`);
  if (!res.ok) throw new Error('Failed to fetch plant');
  return res.json();
};

export const fetchUserGarden = async (token) => {
  const res = await fetch('/api/users/me/garden', {
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user garden');
  return res.json();
};

export const addPlantToUserGarden = async (plantId, token) => {
  const res = await fetch(`/api/plants/${plantId}/addToUser`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to add plant to garden');
  return res.json();
};

export const removeUserGardenPlant = async (entryId, token) => {
  const res = await fetch(`/api/users/me/garden/${entryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to remove plant from garden');
  return res.json();
};

export const waterUserGardenPlant = async (entryId, token) => {
  const res = await fetch(`/api/users/me/garden/${entryId}/water`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token || getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to update watering');
  return res.json();
};

export const addCustomPlantToGarden = async (plantData, token) => {
  const res = await fetch('/api/users/me/garden/custom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || getToken()}`,
    },
    body: JSON.stringify(plantData),
  });
  if (!res.ok) throw new Error('Failed to add custom plant');
  return res.json();
};
