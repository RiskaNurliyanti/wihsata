'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import type { Destination } from '@/types/database.types';

// Perbaikan default icon Leaflet yang rusak saat bundling dengan Webpack/Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;background:#279470;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(39,148,112,0.25)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface MapViewProps {
  destinations: Destination[];
  center?: [number, number];
  userLocation?: [number, number] | null;
  zoom?: number;
  className?: string;
}

/** Re-center peta secara imperatif saat `center` berubah (mis. hasil pencarian baru). */
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function MapView({ destinations, center, userLocation, zoom = 12, className }: MapViewProps) {
  const mapCenter: [number, number] =
    center ?? userLocation ?? (destinations[0] ? [destinations[0].latitude, destinations[0].longitude] : [-2.5, 118]);

  return (
    <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom className={className} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap center={mapCenter} />

      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>Lokasi Anda</Popup>
        </Marker>
      )}

      {destinations.map((dest) => (
        <Marker key={dest.id} position={[dest.latitude, dest.longitude]} icon={defaultIcon}>
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold">{dest.name}</p>
              {dest.address && <p className="mt-0.5 text-xs text-muted-foreground">{dest.address}</p>}
              <Link href={`/explore/${dest.slug}`} className="mt-1.5 inline-block text-xs font-medium text-primary-600 hover:underline">
                Lihat detail →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
