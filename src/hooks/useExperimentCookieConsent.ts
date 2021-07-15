import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import UseExperimentContext from './useExperimentContext';
import {
  EXPERIMENT_CONSENT,
  OPT_OUT,
  getParsedCookies,
  writeCookie,
} from '../utils';

const useExperimentCookieConsent = () => {
  const cookies = getParsedCookies();
  const hasNotYetAsked = typeof cookies[EXPERIMENT_CONSENT] === 'undefined';
  
  const { hasConsent, updateConsent } = UseExperimentContext();
  const [isAwaitingConsentResponse, setIsAwaitingConsentResponse] = useState<boolean>(!hasConsent && hasNotYetAsked);
  const [hasMadeSelection, setHasMadeSelection] = useState<boolean>(false);

  useEffect(() => {
    if (hasMadeSelection || (hasConsent && hasNotYetAsked)) {
      const cookieValue = hasConsent ? nanoid() : OPT_OUT;
      writeCookie(EXPERIMENT_CONSENT, cookieValue);
      setIsAwaitingConsentResponse(false);
    }
  }, [hasConsent, hasMadeSelection, hasNotYetAsked]);

  const consentGranted = useCallback(() => {
    updateConsent(true);
    setHasMadeSelection(true);
  }, [setHasMadeSelection, updateConsent]);

  const consentDenied = useCallback(() => {
    updateConsent(false);
    setHasMadeSelection(true);
  }, [setHasMadeSelection, updateConsent]);

  return {
    hasConsent,
    isAwaitingConsentResponse,
    consentGranted,
    consentDenied,
  };
};

export default useExperimentCookieConsent;
