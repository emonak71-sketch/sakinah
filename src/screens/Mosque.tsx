import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Share2, Waves, User, Accessibility, Car, Star, Loader2, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

// Custom Marker Icon using Lucide
const createCustomIcon = (color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ color }}>
      <MapPin size={32} fill="currentColor" stroke="white" strokeWidth={2} />
    </div>
  );
  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const userIcon = createCustomIcon('#003527'); // Primary color
const mosqueIcon = createCustomIcon('#735c00'); // Secondary color

interface MosqueData {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  distance?: number;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function Mosque() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mosques, setMosques] = useState<MosqueData[]>([]);
  const [selectedMosque, setSelectedMosque] = useState<MosqueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingMosques, setFetchingMosques] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const requestLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchNearbyMosques(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        if (err.code === 1) {
          setError('লোকেশন পারমিশন ব্লক করা হয়েছে। ব্রাউজার সেটিংস থেকে পারমিশন দিন।');
        } else {
          setError('লোকেশন পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।');
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const fetchNearbyMosques = async (lat: number, lng: number) => {
    setFetchingMosques(true);
    setError(null);
    
    const mirrors = [
      'https://overpass-api.de/api/interpreter',
      'https://lz4.overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter'
    ];

    // Reduced radius to 2km for faster response
    const query = `[out:json][timeout:15];
      (
        node["amenity"="place_of_worship"]["religion"="muslim"](around:2000,${lat},${lng});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:2000,${lat},${lng});
        relation["amenity"="place_of_worship"]["religion"="muslim"](around:2000,${lat},${lng});
      );
      out center;`;

    let lastError = null;

    // Helper for fetch with timeout
    const fetchWithTimeout = async (url: string, options: any = {}, timeout = 8000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
      } catch (e) {
        clearTimeout(id);
        throw e;
      }
    };

    for (const mirror of mirrors) {
      try {
        console.log(`Trying mirror: ${mirror}`);
        const response = await fetchWithTimeout(`${mirror}?data=${encodeURIComponent(query)}`, {}, 8000);
        
        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        if (data.elements && data.elements.length > 0) {
          const mappedMosques = data.elements.map((el: any) => {
            const latVal = el.lat || (el.center && el.center.lat);
            const lonVal = el.lon || (el.center && el.center.lon);
            return {
              id: el.id,
              name: el.tags.name || 'নামহীন মসজিদ',
              lat: latVal,
              lon: lonVal,
              address: el.tags['addr:street'] || el.tags['addr:full'] || 'ঠিকানা পাওয়া যায়নি',
              distance: calculateDistance(lat, lng, latVal, lonVal)
            };
          }).filter((m: any) => m.lat && m.lon)
            .sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

          setMosques(mappedMosques);
          if (mappedMosques.length > 0) setSelectedMosque(mappedMosques[0]);
          setFetchingMosques(false);
          return;
        }
      } catch (err) {
        console.warn(`Mirror ${mirror} failed or timed out:`, err);
        lastError = err;
      }
    }

    // Fallback to Nominatim (often faster)
    try {
      console.log('Attempting Nominatim fallback...');
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=mosque&format=json&lat=${lat}&lon=${lng}&addressdetails=1&limit=15`;
      const response = await fetchWithTimeout(nominatimUrl, {
        headers: { 'Accept-Language': 'bn,en' }
      }, 5000);

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const mappedMosques = data.map((el: any) => ({
            id: el.place_id,
            name: el.display_name.split(',')[0] || 'নামহীন মসজিদ',
            lat: parseFloat(el.lat),
            lon: parseFloat(el.lon),
            address: el.display_name,
            distance: calculateDistance(lat, lng, parseFloat(el.lat), parseFloat(el.lon))
          })).sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

          setMosques(mappedMosques);
          if (mappedMosques.length > 0) setSelectedMosque(mappedMosques[0]);
          setFetchingMosques(false);
          return;
        }
      }
    } catch (err) {
      console.error('Nominatim fallback failed:', err);
    }

    setFetchingMosques(false);
    if (mosques.length === 0) {
      setError('আশেপাশে কোনো মসজিদ পাওয়া যায়নি অথবা সার্ভার স্লো। গুগল ম্যাপে দেখুন।');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  const openInGoogleMaps = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
  };

  const openSearchInGoogleMaps = () => {
    if (location) {
      window.open(`https://www.google.com/maps/search/mosque/@${location.lat},${location.lng},15z`, '_blank');
    }
  };

  return (
    <div className="relative h-[calc(100vh-140px)] -mx-6 -mt-24 overflow-hidden">
      {/* Map Area */}
      <div className="absolute inset-0 z-0 bg-surface-container">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-primary font-bold">লোকেশন খোঁজা হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center gap-4">
            <MapPin className="w-12 h-12 text-error opacity-50" />
            <p className="text-on-surface-variant font-medium">{error}</p>
            <button 
              onClick={requestLocation}
              className="px-6 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-lg active:scale-95 transition-all"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : location ? (
          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater center={[location.lat, location.lng]} />
            
            {/* User Marker */}
            <Marker position={[location.lat, location.lng]} icon={userIcon}>
              <Popup>আপনার অবস্থান</Popup>
            </Marker>

            {/* Mosque Markers */}
            {mosques.map((mosque) => (
              <Marker 
                key={mosque.id} 
                position={[mosque.lat, mosque.lon]} 
                icon={mosqueIcon}
                eventHandlers={{
                  click: () => setSelectedMosque(mosque),
                }}
              >
                <Popup>{mosque.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : null}
      </div>

      {/* Search & Location */}
      <div className="absolute top-24 left-6 right-6 z-20 flex gap-3">
        <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 flex items-center shadow-lg border border-primary/5">
          <Search className="w-5 h-5 text-on-surface-variant mr-3" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="মসজিদ খুঁজুন..."
            className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-medium placeholder:text-on-surface-variant/60"
          />
        </div>
        <button 
          onClick={openSearchInGoogleMaps}
          title="গুগল ম্যাপে দেখুন"
          className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Drawer */}
      {!loading && !error && selectedMosque && (
        <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-32">
          <div className="glass-drawer max-w-lg mx-auto rounded-[32px] overflow-hidden shadow-2xl border border-white/40">
            <div className="w-full flex justify-center py-3">
              <div className="w-12 h-1.5 bg-on-surface/10 rounded-full" />
            </div>
            <div className="px-6 pb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-headline text-primary mb-1">{selectedMosque.name}</h2>
                  <p className="text-on-surface-variant flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3" />
                    {selectedMosque.address} • {selectedMosque.distance ? (selectedMosque.distance < 1 ? `${(selectedMosque.distance * 1000).toFixed(0)} মিটার` : `${selectedMosque.distance.toFixed(1)} কি.মি.`) : ''} দূরে
                  </p>
                </div>
                {selectedMosque.distance && selectedMosque.distance < 0.5 && (
                  <div className="bg-secondary-fixed-dim/20 text-secondary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    নিকটতম
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Waves, label: 'অজুখানা', value: 'উপলব্ধ' },
                  { icon: User, label: 'মহিলা শাখা', value: 'আলাদা ব্যবস্থা' },
                  { icon: Accessibility, label: 'প্রবেশগম্যতা', value: 'সহজলভ্য' },
                  { icon: Car, label: 'পার্কিং', value: 'সীমিত' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/60 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 font-bold">{item.label}</p>
                      <p className="text-sm font-bold text-on-surface">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => openInGoogleMaps(selectedMosque.lat, selectedMosque.lon)}
                  className="flex-[2] bg-primary text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <Navigation className="w-5 h-5 fill-current" />
                  গুগল ম্যাপে দেখুন
                </button>
                <button className="flex-1 bg-surface-container-high text-primary py-4 rounded-full font-bold flex items-center justify-center active:scale-95 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {fetchingMosques && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs font-bold text-primary">মসজিদ খোঁজা হচ্ছে...</span>
        </div>
      )}
    </div>
  );
}
