import { useState, useEffect, useCallback } from 'react';
import { checkApiStatus } from '../services/apiService';

export function useApiStatus(options: { checkOnMount?: boolean; autoCheck?: boolean } = {}): {
  isOnline: boolean;
  checkStatus: () => Promise<boolean>;
} {
  const { checkOnMount = true, autoCheck = false } = options;
  const [isOnline, setIsOnline] = useState(true);

  const checkStatus = useCallback(async (): Promise<boolean> => {
    const result = await checkApiStatus();
    setIsOnline(result.isOnline);
    return result.isOnline;
  }, []);

  useEffect(() => {
    if (checkOnMount) checkStatus();
  }, [checkOnMount, checkStatus]);

  useEffect(() => {
    if (!autoCheck) return;
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [autoCheck, checkStatus]);

  return { isOnline, checkStatus };
}
