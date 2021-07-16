import { MutableRefObject, useCallback } from "react";
import { ExperimentEvent } from "./useExperiment";

const useBindEventEmitter = (
  hasConsent: boolean,
  queueRef: MutableRefObject<ExperimentEvent[]>,
  experimentMountTimes: MutableRefObject<Record<string, Date>>,
  emitEventsCallback: () => void,
) => {

  const bindEventEmitter = useCallback((experiment: string, variant: string) => (type: string) => {
      const now = new Date();
      const mountTime = experimentMountTimes.current[experiment];
      queueRef.current.push({
        type,
        timestamp: now.toISOString(),
        experiment,
        variant,
        timeInMsSinceMount: mountTime ? (now.valueOf() - mountTime.valueOf()) : 0,
      });
      if (hasConsent) {
        emitEventsCallback();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasConsent]);

  return bindEventEmitter;
};

export default useBindEventEmitter;
