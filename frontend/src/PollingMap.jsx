import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { API_BASE_URL } from './config';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const mockStations = [
  { id: 1, name: "NDMC School Polling Booth", location: { lat: 28.6149, lng: 77.2090 } },
  { id: 2, name: "Community Center Booth", location: { lat: 28.6129, lng: 77.2110 } },
  { id: 3, name: "Govt Girls Sr Sec School Booth", location: { lat: 28.6159, lng: 77.2070 } }
];

function MapContent({ apiKey }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [selectedStation, setSelectedStation] = useState(null);

  const onLoad = useCallback(function callback() {
    // Map loaded
  }, []);

  const onUnmount = useCallback(function callback() {
    // Map unmounted
  }, []);

  if (!isLoaded) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
      }}
    >
      {mockStations.map(station => (
        <MarkerF
          key={station.id}
          position={station.location}
          onClick={() => setSelectedStation(station)}
          animation={window.google.maps.Animation.DROP}
        />
      ))}

      {selectedStation && (
        <InfoWindowF
          position={selectedStation.location}
          onCloseClick={() => setSelectedStation(null)}
        >
          <div style={{ 
            padding: '12px', 
            maxWidth: '220px',
            backgroundColor: '#1E1E2E', // Modern dark background
            color: 'white',
            borderRadius: '12px',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#A78BFA' }}>
              {selectedStation.name}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.85rem', opacity: 0.9 }}>
              <span style={{ color: '#10B981' }}>●</span> Open: 7 AM - 6 PM
            </div>
            <button 
              style={{ 
                width: '100%',
                padding: '8px',
                background: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Get Directions
            </button>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

export default function PollingMap() {
  const [apiKey, setApiKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/config/maps`)
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          setError("Maps API Key missing");
        }
      })
      .catch(err => {
        console.error("Failed to load Maps config:", err);
        setError("Failed to load Maps configuration");
      });
  }, []);

  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!apiKey) return <div style={{ padding: '2rem', textAlign: 'center' }}>Initializing Map Engine...</div>;

  return (
    <div style={{ marginTop: '2rem', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Polling Station Finder</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Find your nearest designated voting booth.</p>
      </div>
      <MapContent apiKey={apiKey} />
    </div>
  );
}
