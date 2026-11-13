// File: src/core/hooks/useRequest.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook standard pour exécuter une requête asynchrone avec gestion automatique du cycle de vie
 */
export const useRequest = (asyncFn, deps = [], autoExecute = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoExecute);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asyncFn, ...deps]
  );

  useEffect(() => {
    if (autoExecute) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload: execute, execute };
};

export default useRequest;
