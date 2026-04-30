import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

// Default center: New Delhi
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

// Mock polling stations around the center
const mockStations = [
  { id: 1, name: "NDMC School Polling Booth", location: { lat: 28.6149, lng: 77.2090 } },
  { id: 2, name: "Community Center Booth", location: { lat: 28.6129, lng: 77.2110 } },
  { id: 3, name: "Govt Girls Sr Sec School Booth", location: { lat: 28.6159, lng: 77.2070 } }
];

export default function PollingMap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Maps...</div>;

  return (
    <div style={{ marginTop: '2rem', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Polling Station Finder</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Find your nearest designated voting booth.</p>
      </div>
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
          <Marker
            key={station.id}
            position={station.location}
            onClick={() => setSelectedStation(station)}
          />
        ))}

        {selectedStation && (
          <InfoWindow
            position={selectedStation.location}
            onCloseClick={() => setSelectedStation(null)}
          >
            <div style={{ padding: '0.5rem', color: 'black' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{selectedStation.name}</h4>
              <p style={{ margin: 0 }}>Open: 7:00 AM - 6:00 PM</p>
              <button 
                style={{ marginTop: '0.5rem', background: '#4F46E5', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Get Directions
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
