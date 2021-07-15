import { useCallback } from "react";
import useExperimentContext from "./useExperimentContext";

const useExperimentData = (experiment: string) => {
  const {
    experimentCache,
    eventEmitterBinder,
  } = useExperimentContext();

  const variant = experimentCache[experiment];
  const experimentEventEmitter = eventEmitterBinder(experiment, variant);
  const emitConversionEvent = useCallback(() => {
    experimentEventEmitter('CONVERSION');
  }, [experimentEventEmitter]);

  return { variant, emitConversionEvent, experimentEventEmitter };
};

export default useExperimentData;
