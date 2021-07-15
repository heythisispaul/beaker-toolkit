import { MutableRefObject, useCallback } from "react";
import { debounce } from 'debounce';
import { ExperimentEvent } from "./useExperiment";

const useBindEventEmitter = (
  hasConsent: boolean,
  queueRef: MutableRefObject<ExperimentEvent[]>,
  experimentEventHandler: any,
  eventDebounceDelay: number
) => {
  const emit = () => {
    const events = [...queueRef.current];
    if (events.length > 0) {
      experimentEventHandler ? experimentEventHandler(events) : console.log(events);
      queueRef.current = [];
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const emitEventsCallback = useCallback(debounce(emit, eventDebounceDelay), []);

  const bindEventEmitter = useCallback((experiment: string, variant: string) => (type: string) => {
    if (hasConsent) {
      queueRef.current.push({
        type,
        timestamp: new Date().toISOString(),
        experiment,
        variant,
      });
      emitEventsCallback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasConsent]);

  return bindEventEmitter;
};

export default useBindEventEmitter;
