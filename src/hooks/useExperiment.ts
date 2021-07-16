import { useState, useEffect } from "react";
import useExperimentContext from "./useExperimentContext";

export interface ExperimentEvent {
  timestamp: string;
  type: string;
  experiment: string;
  variant: string;
  timeInMsSinceMount: number;
}

const useExperiment = (experimentName: string, variantOverride?: string) => {
  const {
    hasConsent,
    experimentCache,
    variantErrorHandler,
    setExperimentMountTime,
    getExperimentMountTime,
    setExperimentVariant,
    eventEmitterBinder,
    variantIssueUrlHandler,
    fetchClient,
  } = useExperimentContext();
  
  const variant = variantOverride || experimentCache[experimentName];

  const [isLoading, setIsLoading] = useState<boolean>(!Boolean(variant));

  useEffect(() => {
    if (variant && !getExperimentMountTime(experimentName)) {
      setExperimentMountTime(experimentName);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  useEffect(() => {
    if (variantOverride && !experimentCache[experimentName]) {
      setExperimentVariant(experimentName, variantOverride);
    }
  }, [variantOverride, experimentCache, setExperimentVariant, experimentName]);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const fetcher = fetchClient ? fetchClient : fetch;
        const url = variantIssueUrlHandler ? variantIssueUrlHandler(experimentName) : `/the-url/${experimentName}`;
        const response = await fetcher(url);
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
  }, [variant, experimentName, setExperimentVariant, variantErrorHandler, fetchClient, variantIssueUrlHandler]);

  const emitExperimentEvent = eventEmitterBinder(experimentName, variant);

  return {
    hasConsent,
    isLoading,
    emitExperimentEvent,
    variant,
  };
};

export default useExperiment;
