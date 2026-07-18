import { useState, useEffect } from 'react';
import { getSystemSensorsMetadata } from '../services/sensorService';
import { getSensorIndexes } from '../services/sensorService';

// Datos mock para desarrollo - Constantes fuera del componente
const MOCK_ZONES = [
  {
    name: 'Guadalupe',
    sensors: [{ ID: 'ANL10' }, { ID: 'ANL11' }],
    lat: 25.6767,
    lon: -100.2595
  },
  {
    name: 'Monterrey',
    sensors: [{ ID: 'ANL12' }, { ID: 'ANL13' }],
    lat: 25.6866,
    lon: -100.3161
  },
  {
    name: 'San Pedro',
    sensors: [{ ID: 'ANL14' }],
    lat: 25.6519,
    lon: -100.4058
  },
  {
    name: 'San Nicolás',
    sensors: [{ ID: 'ANL15' }],
    lat: 25.7419,
    lon: -100.2895
  }
];

/**
 * Hook personalizado para obtener y procesar datos de sensores para la landing page
 * Agrupa sensores por zona y calcula promedios de calidad del aire
 */
const useLandingData = () => {
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneData, setZoneData] = useState(null);

  // Obtener todos los sensores del sistema al cargar
  useEffect(() => {
    const fetchSensorsData = async () => {
      try {
        setLoading(true);
        console.log('Fetching sensors metadata...');
        const sensorsMetadata = await getSystemSensorsMetadata("AireNuevoLeon");
        console.log('Sensors metadata received:', sensorsMetadata);
        
        if (!sensorsMetadata || sensorsMetadata.length === 0) {
          console.warn('No sensors metadata received, using mock data');
          // Usar datos mock si el API falla
          setZones(MOCK_ZONES);
          setSelectedZone(MOCK_ZONES[0]); // Guadalupe por defecto
          setLoading(false);
          return;
        }
        
        // Log para ver la estructura de un sensor
        console.log('Sample sensor structure:', sensorsMetadata[0]);
        
        // Agrupar sensores por zona
        const zonesMap = {};
        
        sensorsMetadata.forEach(sensor => {
          // Intentar obtener zona de diferentes campos posibles
          const zoneName = sensor.Address?.zone 
            || sensor.Address?.Zone 
            || sensor.Address?.city 
            || sensor.Address?.City
            || sensor.zone
            || sensor.Zone
            || 'Sin Zona';
          
          console.log(`Sensor ${sensor.ID}: zone = "${zoneName}"`);
          
          // NO filtrar zonas desconocidas, las necesitamos
          
          if (!zonesMap[zoneName]) {
            zonesMap[zoneName] = {
              name: zoneName,
              sensors: [],
              lat: sensor.Address?.lat || sensor.lat,
              lon: sensor.Address?.lon || sensor.lon
            };
          }
          zonesMap[zoneName].sensors.push(sensor);
        });

        // Convertir a array y ordenar alfabéticamente
        const zonesArray = Object.values(zonesMap).sort((a, b) => 
          a.name.localeCompare(b.name)
        );

        console.log('Zones processed:', zonesArray);
        console.log('Total zones found:', zonesArray.length);
        
        // Si no hay zonas después del procesamiento, usar mock data
        if (zonesArray.length === 0) {
          console.warn('No zones found after processing, using mock data');
          setZones(MOCK_ZONES);
          setSelectedZone(MOCK_ZONES[0]);
          setLoading(false);
          return;
        }
        
        setZones(zonesArray);
        
        // Seleccionar zona por defecto: Guadalupe > Monterrey > primera disponible
        if (zonesArray.length > 0) {
          const defaultZone = zonesArray.find(z => z.name === 'Guadalupe') 
            || zonesArray.find(z => z.name === 'Monterrey') 
            || zonesArray[0];
          console.log('Selected default zone:', defaultZone.name);
          setSelectedZone(defaultZone);
        }
      } catch (error) {
        console.error('Error fetching sensors data:', error);
        // Usar datos mock en caso de error
        console.log('Using mock data due to error');
        setZones(MOCK_ZONES);
        setSelectedZone(MOCK_ZONES[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorsData();
  }, []);

  // Obtener datos de la zona seleccionada
  useEffect(() => {
    if (!selectedZone || !selectedZone.sensors.length) {
      setZoneData(null);
      return;
    }

    const fetchZoneData = async () => {
      try {
        console.log('Fetching data for zone:', selectedZone.name);
        
        // Intentar obtener datos reales
        const sensorPromises = selectedZone.sensors.map(sensor => 
          getSensorIndexes(sensor.ID).catch(err => {
            console.error(`Error fetching data for sensor ${sensor.ID}:`, err);
            return null;
          })
        );

        const results = await Promise.all(sensorPromises);
        
        // Filtrar resultados válidos
        const validResults = results.filter(r => r && r.ok);
        
        if (validResults.length === 0) {
          console.log('No valid results, using mock data for zone:', selectedZone.name);
          // Usar datos mock con variación según la zona
          const mockData = generateMockDataForZone(selectedZone.name);
          setZoneData(mockData);
          return;
        }

        // Procesar datos reales
        const dataPromises = validResults.map(r => r.json());
        const sensorsData = await Promise.all(dataPromises);

        // Calcular promedio de PM10 (o el contaminante principal)
        const processedData = calculateZoneAverages(sensorsData);
        
        setZoneData(processedData);
      } catch (error) {
        console.error('Error fetching zone data:', error);
        // Usar datos mock en caso de error
        const mockData = generateMockDataForZone(selectedZone.name);
        setZoneData(mockData);
      }
    };

    fetchZoneData();
  }, [selectedZone]);

  return {
    loading,
    zones,
    selectedZone,
    setSelectedZone,
    zoneData
  };
};

/**
 * Genera datos mock variados según la zona
 */
const generateMockDataForZone = (zoneName) => {
  const zoneVariations = {
    'Guadalupe': {
      PM10: { value: 42, status: 'Good' },
      PM25: { value: 18, status: 'Good' },
      O3: { value: 0.052, status: 'Acceptable' },
      CO: { value: 0.6, status: 'Good' },
      NO2: { value: 0.028, status: 'Good' },
      SO2: { value: 0.010, status: 'Good' }
    },
    'Monterrey': {
      PM10: { value: 65, status: 'Acceptable' },
      PM25: { value: 28, status: 'Acceptable' },
      O3: { value: 0.075, status: 'Acceptable' },
      CO: { value: 1.2, status: 'Good' },
      NO2: { value: 0.045, status: 'Good' },
      SO2: { value: 0.015, status: 'Good' }
    },
    'San Pedro': {
      PM10: { value: 35, status: 'Good' },
      PM25: { value: 12, status: 'Good' },
      O3: { value: 0.038, status: 'Good' },
      CO: { value: 0.4, status: 'Good' },
      NO2: { value: 0.020, status: 'Good' },
      SO2: { value: 0.006, status: 'Good' }
    },
    'San Nicolás': {
      PM10: { value: 78, status: 'Acceptable' },
      PM25: { value: 32, status: 'Acceptable' },
      O3: { value: 0.088, status: 'Acceptable' },
      CO: { value: 1.5, status: 'Good' },
      NO2: { value: 0.055, status: 'Acceptable' },
      SO2: { value: 0.018, status: 'Good' }
    }
  };

  const defaultData = {
    PM10: { value: 45, status: 'Good' },
    PM25: { value: 20, status: 'Good' },
    O3: { value: 0.050, status: 'Good' },
    CO: { value: 0.8, status: 'Good' },
    NO2: { value: 0.030, status: 'Good' },
    SO2: { value: 0.012, status: 'Good' }
  };

  const data = zoneVariations[zoneName] || defaultData;
  
  return {
    contaminants: {
      PM10: data.PM10.value,
      PM25: data.PM25.value,
      O3: data.O3.value,
      CO: data.CO.value,
      NO2: data.NO2.value,
      SO2: data.SO2.value
    },
    statuses: {
      PM10: data.PM10.status,
      PM25: data.PM25.status,
      O3: data.O3.status,
      CO: data.CO.status,
      NO2: data.NO2.status,
      SO2: data.SO2.status
    },
    mainValue: data.PM10.value,
    mainStatus: data.PM10.status,
    timestamp: new Date().toISOString()
  };
};

/**
 * Calcula promedios de contaminantes para una zona
 */
const calculateZoneAverages = (sensorsData) => {
  if (!sensorsData || sensorsData.length === 0) return null;

  const contaminants = ['PM10', 'PM25', 'O3', 'CO', 'NO2', 'SO2'];
  const averages = {};
  const statuses = {};

  contaminants.forEach(contaminant => {
    const values = [];
    const statusList = [];
    const contaminantLower = contaminant.toLowerCase();

    sensorsData.forEach(sensorData => {
      // Intentar con mayúsculas primero, luego minúsculas (para compatibilidad con mock data)
      const data = sensorData[contaminant] || sensorData[contaminantLower];
      
      if (data) {
        // Intentar obtener el valor de diferentes fuentes
        const value = data.value || data.hourly?.value || data.icar?.value;
        const status = data.status || data.hourly?.status || data.icar?.status;
        
        if (value !== null && value !== undefined && !isNaN(value)) {
          values.push(value);
          if (status) {
            // Convertir status de formato "good" a "Good"
            const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, '');
            statusList.push(normalizedStatus === 'Extremelybad' ? 'ExtremelyBad' : normalizedStatus);
          }
        }
      }
    });

    if (values.length > 0) {
      // Calcular promedio
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      averages[contaminant] = parseFloat(avg.toFixed(2));

      // Determinar status más crítico
      const criticalStatus = statusList.length > 0 ? getMostCriticalStatus(statusList) : 'NoData';
      statuses[contaminant] = criticalStatus;
    } else {
      averages[contaminant] = null;
      statuses[contaminant] = 'NoData';
    }
  });

  // Calcular índice general (basado en PM10 principalmente)
  const mainValue = averages.PM10 || averages.PM25 || 0;
  const mainStatus = statuses.PM10 || statuses.PM25 || 'NoData';

  return {
    contaminants: averages,
    statuses,
    mainValue,
    mainStatus,
    timestamp: new Date().toISOString()
  };
};

/**
 * Determina el status más crítico de una lista
 */
const getMostCriticalStatus = (statusList) => {
  const priority = {
    'ExtremelyBad': 5,
    'Extremelybad': 5,
    'VeryBad': 4,
    'Verybad': 4,
    'Bad': 3,
    'Acceptable': 2,
    'Good': 2,
    'NoData': 0
  };

  let mostCritical = 'NoData';
  let highestPriority = 0;

  statusList.forEach(status => {
    const currentPriority = priority[status] || 0;
    if (currentPriority > highestPriority) {
      highestPriority = currentPriority;
      // Normalizar el status
      if (status === 'Extremelybad') {
        mostCritical = 'ExtremelyBad';
      } else if (status === 'Verybad') {
        mostCritical = 'VeryBad';
      } else {
        mostCritical = status;
      }
    }
  });

  return mostCritical;
};

export default useLandingData;
