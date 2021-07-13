import { useMemo } from 'react';
import { getParsedCookies, EXPERIMENT_CONSENT } from '../utils';

const useHasCookieConsent = () => {
  const hasCookieConsent = useMemo(() => {
    const cookies = getParsedCookies();
    const hasConsent = cookies[EXPERIMENT_CONSENT] === 'true';
    return hasConsent;
  }, [document.cookie]);

  return hasCookieConsent;
};

export default useHasCookieConsent;
