import { useState, useEffect } from 'react';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Request to get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // First call to get city name (not provided by Open-Meteo) then call Open-Meteo API
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoResponse.json();
          const city = geoData.address.city || geoData.address.town || geoData.address.village || 'Unknown';

          const response = await fetch(
            `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
          );
          
          
          if (!response.ok) throw new Error('Error al obtener el clima');
          
          const data = await response.json();
          
          // Store state
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            temp_unit: data.current_units.temperature_2m,
            wind: data.current.wind_speed_10m,
            wind_unit: data.current_units.wind_speed_10m,
            city: city,
            humidity: data.hourly.relative_humidity_2m[new Date().getHours()],
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Permiso de ubicación denegado");
        setLoading(false);
      }
    );
  }, []); // Runs only when the component mounts

  return { weather, loading, error };
};