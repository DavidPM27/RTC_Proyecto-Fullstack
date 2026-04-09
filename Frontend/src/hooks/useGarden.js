import { useContext } from 'react';
import { GardenContext } from '../context/GardenContext';

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden debe ser usado dentro de un GardenProvider');
  }
  return context;
};
