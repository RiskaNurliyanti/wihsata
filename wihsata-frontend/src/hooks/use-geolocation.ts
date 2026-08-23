'use client';

import { useCallback, useState } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error' | 'denied';
}

/**
 * Hook untuk meminta izin lokasi pengguna via Browser Geolocation API.
 * Dipakai di halaman Nearby untuk mendeteksi posisi awal.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    status: 'idle',
  });

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, status: 'error', error: 'Browser tidak mendukung geolocation.' }));
      return;
    }

    setState((s) => ({ ...s, status: 'loading' }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          status: 'success',
        });
      },
      (error) => {
        const isDenied = error.code === error.PERMISSION_DENIED;
        setState((s) => ({
          ...s,
          status: isDenied ? 'denied' : 'error',
          error: isDenied
            ? 'Izin lokasi ditolak. Aktifkan lokasi di pengaturan browser untuk melihat wisata terdekat.'
            : 'Gagal mendapatkan lokasi. Coba lagi.',
        }));
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }, []);

  return { ...state, requestLocation };
}
