import { useEffect, useState } from "react";

/**
 * Retarde la valeur retournée de `delay` ms
 * @param {any} value - La valeur à debouncer
 * @param {number} delay - Le délai en ms (400 par défaut)
 * @returns {any} La valeur retardée
 */
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // Nettoyage : annule le timer si la valeur change avant la fin
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
