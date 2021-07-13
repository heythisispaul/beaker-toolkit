import { useState, useCallback, useEffect } from 'react';
import {
  EXPERIMENT_CONSENT,
  getParsedCookies,
  writeCookie,
} from '../utils';

export interface UseExperimentConsentOptions {
  hasConsentCheck?: () => boolean;
}

const useExperimentConsent = ({
  hasConsentCheck,
}: UseExperimentConsentOptions) => {
  const cookies = getParsedCookies();
  const consentCookie = cookies[EXPERIMENT_CONSENT];
  const hasAlreadyAsked = typeof consentCookie !== 'undefined';
  const hasAlreadyGivenConsent = (hasConsentCheck && hasConsentCheck()) || Boolean(consentCookie);

  const [hasConsent, setHasConsent] = useState<boolean>(hasAlreadyGivenConsent);
  const [isAwaitingConsentResponse, setIsAwaitingConsentResponse] = useState<boolean>(!hasConsent && !hasAlreadyAsked);
  const [hasMadeSelection, setHasMadeSelection] = useState<boolean>(false);

  useEffect(() => {
    if (hasMadeSelection || hasConsent) {
      writeCookie(EXPERIMENT_CONSENT, hasConsent.toString());
      setIsAwaitingConsentResponse(false);
    }
  }, [hasConsent, consentCookie, hasMadeSelection]);

  const consentGranted = useCallback(() => {
    setHasConsent(true);
    setHasMadeSelection(true);
  }, []);

  const consentDenied = useCallback(() => {
    setHasConsent(false);
    setHasMadeSelection(true);
  }, []);

  return {
    hasConsent,
    isAwaitingConsentResponse,
    consentGranted,
    consentDenied
  };
};

export default useExperimentConsent;
