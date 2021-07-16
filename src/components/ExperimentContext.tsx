import { createContext, useState, useCallback, FC, useRef, useEffect } from 'react';
import { debounce } from 'debounce';
import { hasExperimentConsent } from '../utils';
import { ExperimentEvent } from '../hooks/useExperiment';
import useBindEventEmitter  from '../hooks/useBindEventEmitter';

export interface ExperimentContextProviderProps {
  experimentCache?: Record<string, string>;
  experimentEventHandler?: (events: ExperimentEvent[]) => void | Promise<void>;
  variantErrorHandler?: (experimentName: string, error: any) => void | Promise<void>;
  variantIssueUrlHandler?: (experimentName: string) => string;
  fetchClient?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  eventDebounceDelay?: number;
}

export interface ExperimentContextValue extends ExperimentContextProviderProps {
  hasConsent: boolean;
  getExperimentMountTime: (experiment: string) => Date;
  setExperimentMountTime: (experiment: string) => void;
  updateConsent: (consent: boolean) => void;
  setExperimentVariant: (experiment: string, variant: string) => void;
  experimentCache: Record<string, string>;
  eventsQueue: ExperimentEvent[];
  eventEmitterBinder: (experiment: string, variant: string) => (type: string) => void;
}

export const ExperimentContext = createContext<ExperimentContextValue>({} as any);

const ExperimentContextProvider: FC<ExperimentContextProviderProps> = ({
  children,
  experimentEventHandler,
  variantErrorHandler,
  variantIssueUrlHandler,
  fetchClient,
  experimentCache: providedCache = {},
  eventDebounceDelay = 250,
}) => {
  const hasPreviouslyGivenConsent = hasExperimentConsent();
  const eventsQueueRef = useRef<ExperimentEvent[]>([]);
  const experimentMountTimes = useRef<Record<string, Date>>({});

  const [hasConsent, setHasConsent] = useState<boolean>(hasPreviouslyGivenConsent);
  const [experimentCache, setExperimentCache] = useState<Record<string, string>>(providedCache);

  const emit = () => {
    const events = [...eventsQueueRef.current];
    if (events.length > 0) {
      experimentEventHandler ? experimentEventHandler(events) : console.log(events);
      eventsQueueRef.current = [];
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const emitEventsCallback = useCallback(debounce(emit, eventDebounceDelay), []);

  useEffect(() => {
    if (hasConsent) {
      emitEventsCallback();
    }
  }, [hasConsent, emitEventsCallback]);

  const eventEmitterBinder = useBindEventEmitter(
    hasConsent,
    eventsQueueRef,
    experimentMountTimes,
    emitEventsCallback,
  );

  const setExperimentVariant = useCallback((experiment: string, variant: string) => {
    setExperimentCache({ ...experimentCache, [experiment]: variant });
  }, [setExperimentCache, experimentCache]);

  const setExperimentMountTime = useCallback((experiment: string) => {
    experimentMountTimes.current = { ...experimentMountTimes.current, [experiment]: new Date() };
  }, []);

  const getExperimentMountTime = useCallback((experiment: string) => {
    const mountCopy = { ...experimentMountTimes.current };
    return mountCopy[experiment];
  }, []);

  const initialValue: ExperimentContextValue = {
    hasConsent,
    setExperimentMountTime,
    getExperimentMountTime,
    updateConsent: setHasConsent,
    experimentCache,
    setExperimentVariant,
    variantErrorHandler,
    eventsQueue: eventsQueueRef.current,
    eventEmitterBinder,
    variantIssueUrlHandler,
    fetchClient,
  };

  return (
    <ExperimentContext.Provider value={initialValue}>
      {children}
    </ExperimentContext.Provider>
  )
};

export default ExperimentContextProvider;
