import { createContext, useState, useCallback, useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import {
  fetchUserGarden,
  addPlantToUserGarden,
  removeUserGardenPlant,
  waterUserGardenPlant,
  addCustomPlantToGarden,
} from '../api/plantsApi';

export const GardenContext = createContext();

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

const WATERING_FREQUENCY = {
  Minimum: 21,
  Average: 7,
  Frequent: 3,
};

function transformGardenEntry(entry) {
  const plant = entry.plant || {};
  return {
    id: entry._id || crypto.randomUUID(),
    apiId: plant._id,
    species: plant.common_name || plant.scientific_name || 'Unknown Plant',
    imageUrl: plant.default_image || '',
    category: plant.type || 'Plant',
    stats: {
      plantedAt: plant.createdAt
        ? new Date(plant.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      lastWatered: entry.lastWatered ? new Date(entry.lastWatered).getTime() : Date.now(),
      wateringFrequency: WATERING_FREQUENCY[plant.watering] ?? (parseInt(plant.watering_general_benchmark?.value) || 7),
    },
    requirements: {
      minTemp: parseInt(plant.hardiness?.min) || 10,
      maxTemp: parseInt(plant.hardiness?.max) || 30,
      idealPh: 6.0,
    },
    fullDetails: plant,
  };
}

export const GardenProvider = ({ children }) => {
  const [myGarden, setMyGarden] = useState([]);
  const [gardenLoading, setGardenLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { weather, loading, error } = useWeather();
  const [cachedWeather, setCachedWeather] = useState(null);
  const [plantDetails, setPlantDetails] = useState({});

  useEffect(() => {
    if (weather && !loading) {
      setCachedWeather(weather);
    }
  }, [weather, loading]);

  const loadGarden = useCallback(async (token) => {
    const t = token || getToken();
    if (!t) return;
    setGardenLoading(true);
    try {
      const entries = await fetchUserGarden(t);
      setMyGarden(entries.map(transformGardenEntry));
    } catch {
      setMyGarden([]);
    } finally {
      setGardenLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGarden();
  }, [loadGarden]);

  const addPlantDetails = useCallback((id, details) => {
    setPlantDetails(prev => ({ ...prev, [id]: details }));
  }, []);

  const addPlant = useCallback(async (plantData) => {
    const token = getToken();
    try {
      if (plantData._id) {
        // Catalog plant from Detail page
        await addPlantToUserGarden(plantData._id, token);
      } else {
        // Custom plant from AddPlant form
        await addCustomPlantToGarden({
          common_name: plantData.name || plantData.species,
          scientific_name: plantData.species,
          wateringFrequency: plantData.stats?.wateringFrequency || 7,
          default_image: plantData.imageUrl || '',
        }, token);
      }
      await loadGarden(token);
      setNotification({ type: 'success', message: '¡Planta añadida al huerto!' });
    } catch {
      setNotification({ type: 'error', message: 'Error al añadir la planta.' });
    }
    setTimeout(() => setNotification(null), 3000);
  }, [loadGarden]);

  const removePlant = useCallback(async (plantId) => {
    const token = getToken();
    try {
      await removeUserGardenPlant(plantId, token);
      setMyGarden(prev => prev.filter(p => p.id !== plantId));
      setNotification({ type: 'info', message: 'Planta eliminada correctamente.' });
    } catch {
      setNotification({ type: 'error', message: 'Error al eliminar la planta.' });
    }
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const waterPlant = useCallback(async (plantId) => {
    const token = getToken();
    try {
      await waterUserGardenPlant(plantId, token);
      setMyGarden(prev =>
        prev.map(p =>
          p.id !== plantId ? p : {
            ...p,
            stats: { ...p.stats, lastWatered: new Date().toISOString() },
          }
        )
      );
    } catch {
      // fallo silencioso: el estado local ya se actualizó
    }
  }, []);

  const value = {
    myGarden,
    gardenLoading,
    loadGarden,
    notification,
    addPlant,
    removePlant,
    waterPlant,
    weather: cachedWeather,
    weatherLoading: loading,
    weatherError: error,
    plantDetails,
    addPlantDetails,
  };

  return (
    <GardenContext.Provider value={value}>
      {children}
    </GardenContext.Provider>
  );
};
