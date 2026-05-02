import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { logBoothSearch } from '../utils/analytics';
import { logger } from '../utils/logger';

const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const Locator = () => {
  const { t } = useTranslation();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAPS_API_KEY,
  });

  const [pin, setPin] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [center, setCenter] = useState(defaultCenter);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pin.trim() || !isLoaded) return;
    setSearching(true);
    logBoothSearch(pin);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: `India, PIN ${pin}` }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        const newCoords = { lat: lat(), lng: lng() };
        setCenter(newCoords);
        setResults([
          {
            name: 'Designated Poll Booth',
            address: results[0].formatted_address,
            dist: 'Within 2 km',
          },
          {
            name: 'Secondary Booth (Backup)',
            address: 'Near Government Office, ' + pin,
            dist: '3.5 km',
          },
        ]);
      } else {
        logger.warn('Location not found for this PIN code.');
      }
      setSearching(false);
    });
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-4xl mx-auto py-10 px-6 space-y-10"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-main font-playfair">
          {t('map.title')}
        </h1>
        <p className="text-muted">{t('map.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="card space-y-6">
          <h3 className="font-bold text-blue-main">Search by PIN Code</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              className="input-control font-mono"
              placeholder={t('map.search_placeholder')}
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary px-4"
              aria-label="Search"
            >
              <span className="material-icons" aria-hidden="true">
                search
              </span>
            </button>
          </form>
          <div className="relative border-t border-border-gray pt-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-muted font-bold tracking-widest">
              OR
            </div>
            <button className="btn-secondary w-full">
              <span className="material-icons" aria-hidden="true">
                my_location
              </span>{' '}
              {t('map.use_location')}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-xs font-bold text-muted uppercase">
                Results near {pin}
              </p>
              {results.map((r, i) => (
                <div
                  key={i}
                  className="p-4 bg-blue-pale/50 border border-blue-main/10 rounded-radius-sm"
                >
                  <h4 className="font-bold text-blue-main">{r.name}</h4>
                  <p className="text-xs text-muted mb-3">{r.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-blue-main/20">
                      {r.dist} away
                    </span>
                    <button
                      className="text-xs font-bold text-blue-main flex items-center gap-1 hover:underline"
                      aria-label="Get directions"
                    >
                      <span
                        className="material-icons text-sm"
                        aria-hidden="true"
                      >
                        directions
                      </span>{' '}
                      Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="h-[400px] bg-border-gray rounded-radius flex items-center justify-center relative overflow-hidden border-2 border-white shadow-main">
            {results.length > 0 && isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                options={{ disableDefaultUI: true, zoomControl: true }}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <div className="text-center p-8 space-y-4">
                <span className="material-icons text-4xl text-muted">map</span>
                <p className="text-sm text-muted">
                  {searching
                    ? 'Finding coordinates...'
                    : t('map.search_placeholder')}
                </p>
                <a
                  href="https://voters.eci.gov.in"
                  target="_blank"
                  className="btn-secondary text-xs"
                >
                  {t('map.official_portal')}
                </a>
              </div>
            )}
          </div>
          <div className="bg-amber-main/10 border border-amber-main/30 p-4 rounded-radius flex gap-3 text-amber-main">
            <span className="material-icons text-sm">warning</span>
            <p className="text-[11px] font-medium leading-relaxed">
              {t('map.warning')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

Locator.propTypes = {
  // Locator page props
};

export default Locator;
