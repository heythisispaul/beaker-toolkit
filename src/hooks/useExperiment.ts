import { useEffect, useState, useRef } from 'react';
import useHasCookieConsent from './useHasCookieConsent';

export interface ExperimentEvent {
  type: string;
  experiment: string;
  variant: string;
  timestamp: Date;
}

const useExperiment = (experimentName: string, variantOverride?: string) => {
  const experimentEvents = useRef<ExperimentEvent[]>([]);
  const [isGettingVariant, setIsGettingVariant] = useState<boolean>(false);
};

export default useExperiment;
