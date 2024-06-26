import { useEffect, useState } from 'react';
import { gasesOptions } from '../constants';
import { getSystemSensors } from '../services/sensorService';

const useSystemLocations = (system, idBlacklist) => {
  const [locations, setLocations] = useState([]);
  const [contaminants, setContaminants] = useState([]);

  useEffect(() => {
    if (!system) return;

    const fetchSensors = async () => {
      try {
        const sensors = await getSystemSensors(system.value);
        const newLocations = [];
        for (const sensor of sensors) {
          if (!idBlacklist.includes(sensor.id)) {
            newLocations.push({ value: sensor.id, label: sensor.address.zone });
          }
        }
        setLocations(newLocations);
      } catch (error) {
        console.error('Failed to fetch sensors:', error);
      }
    };

    system.value === "PurpleAir"
      ? setContaminants([gasesOptions[0]])
      : setContaminants(gasesOptions);

    fetchSensors();
  }, [system, idBlacklist]);

  return { locations, contaminants };
};

export default useSystemLocations;
