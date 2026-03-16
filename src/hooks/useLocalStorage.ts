"use client";
import { useState, useEffect } from "react";

// SSR 안전한 localStorage 훅 — 마운트 후 로드
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) setStoredValue(JSON.parse(item));
    } catch (e) {
      console.warn(`useLocalStorage read error [${key}]:`, e);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.warn(`useLocalStorage write error [${key}]:`, e);
    }
  };

  return [storedValue, setValue] as const;
}
