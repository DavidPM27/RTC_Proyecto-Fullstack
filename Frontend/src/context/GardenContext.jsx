import { createContext, useState, useCallback, useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import { fetchUserGarden } from '../api/plantsApi';

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
      wateringFrequency: WATERING_FREQUENCY[plant.watering] ?? 7,
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

  const addPlant = (plantData) => {
    let newPlant;

    if (plantData.apiId || plantData.common_name) {
      const cleanedWaterData = plantData.watering_general_benchmark?.value?.replace(/['"]/g, '');

      newPlant = {
        id: crypto.randomUUID(),
        apiId: plantData._id || plantData.id || plantData.apiId,
        species: plantData.common_name || plantData.scientific_name || 'Unknown Plant',
        imageUrl: plantData.default_image || plantData.imageUrl || 'https://via.placeholder.com/400',
        category: plantData.type || plantData.category || 'Plant',
        stats: {
          plantedAt: plantData.stats?.plantedAt || new Date().toISOString().split('T')[0],
          lastWatered: plantData.stats?.lastWatered || new Date().toISOString(),
          wateringFrequency: plantData.watering_general_benchmark?.value
            ? parseInt(cleanedWaterData?.split('-')[0])
            : (plantData.stats?.wateringFrequency || 7),
        },
        requirements: {
          minTemp: plantData.hardiness?.min ? parseInt(plantData.hardiness.min) : (plantData.requirements?.minTemp || 10),
          maxTemp: plantData.hardiness?.max ? parseInt(plantData.hardiness.max) : (plantData.requirements?.maxTemp || 30),
          idealPh: plantData.requirements?.idealPh || 6.0,
        },
        fullDetails: plantData.description ? plantData : null,
      };

      if (plantData.description) {
        addPlantDetails(newPlant.apiId, plantData);
      }
    } else {
      newPlant = {
        ...plantData,
        id: crypto.randomUUID(),
        apiId: plantData._id,
        stats: {
          ...plantData.stats,
          plantedAt: new Date().toISOString().split('T')[0],
          lastWatered: new Date().toISOString(),
        },
      };
    }

    setMyGarden(prev => [newPlant, ...prev]);
    setNotification({ type: 'success', message: `¡${newPlant.species} añadida al huerto!` });
    setTimeout(() => setNotification(null), 3000);
  };

  const removePlant = useCallback((plantId) => {
    setMyGarden(prev => prev.filter(plant => plant.id !== plantId));
    setNotification({ type: 'info', message: 'Planta eliminada correctamente.' });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const waterPlant = useCallback((plantId) => {
    setMyGarden(prev =>
      prev.map(plant => {
        if (plant.id !== plantId) return plant;
        return {
          ...plant,
          stats: { ...plant.stats, lastWatered: new Date().toISOString() },
        };
      })
    );
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
