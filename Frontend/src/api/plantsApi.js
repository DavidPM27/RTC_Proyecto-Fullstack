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
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user garden');
  return res.json();
};
