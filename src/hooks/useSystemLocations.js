import { useEffect, useState } from 'react';
import { gasesOptions, idBlacklistpriv } from '../constants';
import { getSystemSensors } from '../services/sensorService';

const useSystemLocations = (system_name) => {
  const [locations, setLocations] = useState([]);
  const [contaminants, setContaminants] = useState([]);

  useEffect(() => {
    if (!system_name) return;

    const fetchSensors = async () => {
      try {
        const sensors = await getSystemSensors(system_name);
        const newLocations = [];
        for (const sensor of sensors) {
          if (!idBlacklistpriv.includes(sensor.id)) {
            newLocations.push({ value: sensor, label: sensor.address.zone });
          }
        }
        setLocations(newLocations);
      } catch (error) {
        console.error('Failed to fetch sensors:', error);
      }
    };

    system_name === "PurpleAir"
      ? setContaminants([gasesOptions[0]])
      : setContaminants(gasesOptions);

    fetchSensors();
  }, [system_name]);

  return { locations, contaminants };
};

export default useSystemLocations;
