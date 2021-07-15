import { useState, useEffect } from "react";
import useExperimentContext from "./useExperimentContext";

export interface ExperimentEvent {
  timestamp: string;
  type: string;
  experiment: string;
  variant: string;
}

const useExperiment = (experimentName: string, variantOverride?: string) => {
  const {
    hasConsent,
    experimentCache,
    variantErrorHandler,
    setExperimentVariant,
    eventEmitterBinder,
  } = useExperimentContext();
  
  const variant = variantOverride || experimentCache[experimentName];

  const [isLoading, setIsLoading] = useState<boolean>(!Boolean(variant));

  useEffect(() => {
    if (variantOverride && !experimentCache[experimentName]) {
      setExperimentVariant(experimentName, variantOverride);
    }
  }, [variantOverride, experimentCache, setExperimentVariant, experimentName]);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const response = await fetch(`/the-url/${experimentName}`);
        const variantData = await response.json();
        setExperimentVariant(experimentName, variantData);
      } catch (error) {
        if (variantErrorHandler) {
          await variantErrorHandler(experimentName, error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!variant) {
      fetchVariant();
    }
  }, [variant, experimentName, setExperimentVariant, variantErrorHandler]);

  const emitExperimentEvent = eventEmitterBinder(experimentName, variant);

  return {
    hasConsent,
    isLoading,
    emitExperimentEvent,
    variant,
  };
};

export default useExperiment;
