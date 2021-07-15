import { createContext, useState, useCallback, FC, useRef } from 'react';
import { hasExperimentConsent } from '../utils';
import { ExperimentEvent } from '../hooks/useExperiment';
import useBindEventEmitter  from '../hooks/useBindEventEmitter';

export interface ExperimentContextProviderProps {
  initialCache?: ExperimentContextValue['experimentCache'];
  experimentEventHandler?: (events: ExperimentEvent[]) => void | Promise<void>;
  variantErrorHandler?: (experimentName: string, error: any) => void | Promise<void>;
  eventDebounceDelay?: number;
}

export interface ExperimentContextValue extends ExperimentContextProviderProps {
  hasConsent: boolean;
  updateConsent: (consent: boolean) => void;
  setExperimentVariant: (experiment: string, variant: string) => void;
  experimentCache: Record<string, string>;
  eventsQueue: ExperimentEvent[];
  eventEmitterBinder: (experiment: string, variant: string) => (type: string) => void;
}

export const ExperimentContext = createContext<ExperimentContextValue>({} as any);

const ExperimentContextProvider: FC<ExperimentContextProviderProps> = ({
  children,
  initialCache = {},
  experimentEventHandler,
  variantErrorHandler,
  eventDebounceDelay = 250,
}) => {
  const hasPreviouslyGivenConsent = hasExperimentConsent();
  const eventsQueueRef = useRef<ExperimentEvent[]>([]);
  const [hasConsent, setHasConsent] = useState<boolean>(hasPreviouslyGivenConsent);
  const [experimentCache, setExperimentCache] = useState<Record<string, string>>(initialCache);
  const eventEmitterBinder = useBindEventEmitter(hasConsent, eventsQueueRef, experimentEventHandler, eventDebounceDelay);

  const setExperimentVariant = useCallback((experiment: string, variant: string) => {
    setExperimentCache({ ...experimentCache, [experiment]: variant });
  }, [setExperimentCache, experimentCache]);

  const initialValue: ExperimentContextValue = {
    hasConsent,
    updateConsent: setHasConsent,
    experimentCache,
    setExperimentVariant,
    variantErrorHandler,
    eventsQueue: eventsQueueRef.current,
    eventEmitterBinder,
  };

  return (
    <ExperimentContext.Provider value={initialValue}>
      {children}
    </ExperimentContext.Provider>
  )
};

export default ExperimentContextProvider;
