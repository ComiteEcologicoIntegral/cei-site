import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkedAlt, 
  FaCalendarAlt, 
  FaChartLine, 
  FaInfoCircle,
  FaLightbulb,
  FaShieldAlt
} from 'react-icons/fa';
import useLandingData from '../../hooks/useLandingData';
import { statusClassName } from '../../constants';
import { unidad } from '../../constants';
import './Landing.css';

function Landing() {
  const { loading, zones, selectedZone, setSelectedZone, zoneData } = useLandingData();

  // Mapeo de status a nombres en español
  const statusLabels = {
    'Good': 'Buena',
    'Acceptable': 'Aceptable',
    'Bad': 'Mala',
    'VeryBad': 'Muy Mala',
    'ExtremelyBad': 'Extremadamente Mala',
    'NoData': 'Sin Datos'
  };

  // Mapeo de status a clases CSS
  const statusClasses = {
    'Good': 'status-buena',
    'Acceptable': 'status-aceptable',
    'Bad': 'status-mala',
    'VeryBad': 'status-muy-mala',
    'ExtremelyBad': 'status-extremadamente-mala',
    'NoData': 'status-no-data'
  };

  // Función para obtener el color del status del contaminante
  const getContaminantStatusColor = (status) => {
    const colorMap = {
      'Good': 'var(--color-buena)',
      'Acceptable': 'var(--color-acept)',
      'Bad': 'var(--color-mala)',
      'VeryBad': 'var(--color-muymala)',
      'ExtremelyBad': 'var(--color-extmala)',
      'NoData': 'var(--color-nodata)'
    };
    return colorMap[status] || 'var(--color-nodata)';
  };

  // Formatear timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando datos de calidad del aire...</p>
      </div>
    );
  }

  // Verificar si hay zonas disponibles
  if (!zones || zones.length === 0) {
    return (
      <div className="loading-container">
        <p className="loading-text" style={{ color: '#d9534f' }}>
          No se pudieron cargar las zonas. Por favor, verifica tu conexión e intenta de nuevo.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
          Si el problema persiste, contacta al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <img 
          src="/logo.jpg" 
          alt="Logo CEI" 
          className="landing-hero__logo"
        />
        <h1 className="landing-hero__title">
          Calidad del Aire en Monterrey
        </h1>
        <p className="landing-hero__subtitle">
          Monitoreo en tiempo real de la calidad del aire en el Área Metropolitana de Monterrey
        </p>

        {/* Zone Selector */}
        <div className="zone-selector">
          <label htmlFor="zone-select" className="zone-selector__label">
            Selecciona tu zona:
          </label>
          <select
            id="zone-select"
            className="form-select form-select-lg"
            value={selectedZone?.name || ''}
            onChange={(e) => {
              const zone = zones.find(z => z.name === e.target.value);
              if (zone) {
                setSelectedZone(zone);
              }
            }}
            aria-label="Seleccionar zona de Monterrey"
          >
            {!selectedZone && (
              <option value="" disabled>
                Selecciona una zona
              </option>
            )}
            {zones.map((zone) => (
              <option key={zone.name} value={zone.name}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="landing-dashboard">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__zone-name">
              {selectedZone?.name || 'Selecciona una zona'}
            </h2>
            {zoneData && (
              <p className="dashboard-card__timestamp">
                Actualizado: {formatTimestamp(zoneData.timestamp)}
              </p>
            )}
          </div>

          {!selectedZone ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p style={{ fontSize: '1.1rem' }}>Por favor, selecciona una zona arriba para ver los datos de calidad del aire.</p>
            </div>
          ) : zoneData ? (
            <>
              {/* Main Air Quality Indicator */}
              <div className={`air-quality-main ${statusClasses[zoneData.mainStatus] || 'status-no-data'}`}>
                <div className="air-quality-main__label">
                  Índice de Calidad del Aire
                </div>
                <div className="air-quality-main__value">
                  {zoneData.mainValue || '--'}
                </div>
                <div className="air-quality-main__status">
                  {statusLabels[zoneData.mainStatus] || 'Sin Datos'}
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.9 }}>
                  PM10 (µg/m³)
                </div>
              </div>

              {/* Contaminants Grid */}
              <div className="contaminants-grid">
                {Object.entries(zoneData.contaminants).map(([contaminant, value]) => {
                  const status = zoneData.statuses[contaminant];
                  const displayName = contaminant === 'PM25' ? 'PM2.5' : contaminant;
                  const unit = unidad[contaminant] || '';
                  
                  return (
                    <div key={contaminant} className="contaminant-card">
                      <div className="contaminant-card__name">
                        {displayName}
                      </div>
                      <div 
                        className="contaminant-card__value"
                        style={{ color: getContaminantStatusColor(status) }}
                      >
                        {value !== null ? value : '--'}
                      </div>
                      <div className="contaminant-card__unit">
                        {unit}
                      </div>
                      <span 
                        className="contaminant-card__status"
                        style={{ backgroundColor: getContaminantStatusColor(status) }}
                      >
                        {statusLabels[status] || 'Sin Datos'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No hay datos disponibles para esta zona en este momento.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                Por favor, intenta seleccionar otra zona.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access-section">
        <h2 className="quick-access-section__title">
          Explora más funcionalidades
        </h2>
        <div className="quick-access-grid">
          <Link to="/mapa" className="quick-access-card">
            <div className="quick-access-card__icon">
              <FaMapMarkedAlt />
            </div>
            <h3 className="quick-access-card__title">Mapa Interactivo</h3>
            <p className="quick-access-card__description">
              Visualiza la calidad del aire en tiempo real en todas las estaciones de monitoreo
            </p>
          </Link>

          <Link to="/calendario" className="quick-access-card">
            <div className="quick-access-card__icon">
              <FaCalendarAlt />
            </div>
            <h3 className="quick-access-card__title">Calendario</h3>
            <p className="quick-access-card__description">
              Consulta los datos históricos día por día de cualquier estación
            </p>
          </Link>

          <Link to="/historico" className="quick-access-card">
            <div className="quick-access-card__icon">
              <FaChartLine />
            </div>
            <h3 className="quick-access-card__title">Histórico</h3>
            <p className="quick-access-card__description">
              Analiza tendencias y gráficas de la calidad del aire a lo largo del tiempo
            </p>
          </Link>

          <Link to="/recomendaciones" className="quick-access-card">
            <div className="quick-access-card__icon">
              <FaShieldAlt />
            </div>
            <h3 className="quick-access-card__title">Recomendaciones</h3>
            <p className="quick-access-card__description">
              Conoce las medidas de protección según el nivel de calidad del aire
            </p>
          </Link>
        </div>
      </section>

      {/* Educational Section */}
      <section className="educational-section">
        <h2 className="educational-section__title">
          ¿Qué es la calidad del aire?
        </h2>
        <p className="educational-section__subtitle">
          Aprende sobre los contaminantes que monitoreamos y su impacto en la salud
        </p>

        <div className="educational-grid">
          <div className="educational-card">
            <h3 className="educational-card__title">
              <FaInfoCircle style={{ marginRight: '8px' }} />
              Contaminantes Principales
            </h3>
            <p className="educational-card__description">
              Monitoreamos partículas PM10 y PM2.5, ozono (O3), monóxido de carbono (CO), 
              dióxido de azufre (SO2) y dióxido de nitrógeno (NO2). Cada uno afecta 
              la salud de manera diferente.
            </p>
          </div>

          <div className="educational-card">
            <h3 className="educational-card__title">
              <FaLightbulb style={{ marginRight: '8px' }} />
              Índice de Calidad
            </h3>
            <p className="educational-card__description">
              El índice va desde "Buena" hasta "Extremadamente Mala". Utilizamos estándares 
              oficiales de SEMARNAT y SSA para clasificar los niveles de contaminación 
              y proteger tu salud.
            </p>
          </div>

          <div className="educational-card">
            <h3 className="educational-card__title">
              <FaShieldAlt style={{ marginRight: '8px' }} />
              Protege tu Salud
            </h3>
            <p className="educational-card__description">
              Cuando la calidad del aire es mala, reduce las actividades al aire libre, 
              mantén las ventanas cerradas y usa cubrebocas si es necesario. Los niños y 
              adultos mayores deben tener mayor precaución.
            </p>
          </div>
        </div>

        <div className="educational-cta">
          <Link to="/conceptos" className="btn-learn-more">
            Conocer más sobre contaminantes
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
