// File: src/core/hooks/usePolling.js
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

/**
 * Hook de polling récurrent qui s'arrête automatiquement si l'écran perd le focus ou est démonté.
 * @param {Function} asyncCallback - Fonction asynchrone à appeler à chaque tick
 * @param {number} intervalMs - Intervalle en millisecondes
 * @param {boolean} enabled - Condition d'activation du polling
 */
export const usePolling = (asyncCallback, intervalMs = 4000, enabled = true) => {
  const navigation = useNavigation();
  const savedCallback = useRef(asyncCallback);
  const isFocusedRef = useRef(true);

  useEffect(() => {
    savedCallback.current = asyncCallback;
  }, [asyncCallback]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      isFocusedRef.current = true;
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      isFocusedRef.current = false;
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useEffect(() => {
    if (!enabled || intervalMs <= 0) return;

    let isMounted = true;

    const tick = async () => {
      if (isMounted && isFocusedRef.current && savedCallback.current) {
        try {
          await savedCallback.current();
        } catch (e) {
          console.warn('[usePolling] Erreur tick:', e);
        }
      }
    };

    // Exécute immédiatement le premier appel
    tick();

    const timerId = setInterval(tick, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(timerId);
    };
  }, [intervalMs, enabled]);
};

export default usePolling;
