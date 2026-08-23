'use client';

import { useEffect, useState } from 'react';

/** Debounce sebuah value — berguna untuk search input agar tidak query di tiap keystroke. */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
