import { createContext, useState, useCallback, useEffect } from 'react';
import { INITIAL_PLANTS } from '../api/initialPlants';
import { useWeather } from '../hooks/useWeather';

export const GardenContext = createContext();

export const GardenProvider = ({ children }) => {
  const [myGarden, setMyGarden] = useState(INITIAL_PLANTS);
  const [notification, setNotification] = useState(null);
  const { weather, loading, error } = useWeather();
  const [cachedWeather, setCachedWeather] = useState(null);
  const [plantDetails, setPlantDetails] = useState({});

  useEffect(() => {
    if (weather && !loading) {
      setCachedWeather(weather);
    }
  }, [weather, loading]);

  const addPlantDetails = useCallback((id, details) => {
    setPlantDetails(prev => ({ ...prev, [id]: details }));
  }, []);

  const addPlant = (plantData) => {
    let newPlant;
    
    // Transform data if it comes from Perenual API
    if (plantData.apiId || plantData.common_name) {
      const cleanedWaterData = plantData.watering_general_benchmark?.value?.replace(/['"]/g, '');
      
      newPlant = {
        id: crypto.randomUUID(),
        apiId: plantData.id || plantData.apiId,
        species: plantData.common_name || plantData.scientific_name?.[0] || 'Unknown Plant',
        imageUrl: plantData.default_image?.medium_url || plantData.default_image?.thumbnail || plantData.imageUrl || 'https://via.placeholder.com/400',
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
        fullDetails: plantData.description ? plantData : null
      };

      if (plantData.description) {
        addPlantDetails(newPlant.apiId, plantData);
      }
    } else {
      newPlant = {
        ...plantData,
        id: crypto.randomUUID(),
        stats: {
          ...plantData.stats,
          plantedAt: new Date().toISOString().split('T')[0],
          lastWatered: new Date().toISOString(),
        }
      };
    }

    setMyGarden((prevGarden) => [newPlant, ...prevGarden]);
    setNotification({ type: 'success', message: `¡${newPlant.species} añadida al huerto!` });
    
    setTimeout(() => setNotification(null), 3000);
  };

  const removePlant = useCallback((plantId) => {
    setMyGarden((prevGarden) => prevGarden.filter((plant) => plant.id !== plantId));
    
    setNotification({ type: 'info', message: 'Planta eliminada correctamente.' });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const waterPlant = useCallback((plantId) => {
    setMyGarden((prevGarden) => 
      prevGarden.map((plant) => {
        if (plant.id === plantId) {
          return {
            ...plant,
            stats: {
              ...plant.stats,
              lastWatered: new Date().toISOString()
            }
          };
        }
        return plant;
      })
    );
  }, []);

  const value = {
    myGarden,
    notification,
    addPlant,
    removePlant,
    waterPlant,
    weather: cachedWeather,
    weatherLoading: loading,
    weatherError: error,
    plantDetails,
    addPlantDetails
  };

  return (
    <GardenContext.Provider value={value}>
      {children}
    </GardenContext.Provider>
  );
};