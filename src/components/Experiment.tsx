import {
  useMemo,
  FC,
  Children,
  isValidElement,
  ReactElement,
  JSXElementConstructor,
  cloneElement,
} from 'react';
import { VariantProps } from './Variant';
import useExperiment from '../hooks/useExperiment';

export interface ExperimentProps {
  experimentName: string;
  loadingFallback?: JSXElementConstructor<any>,
  variantOverride?: string;
  disableOnMountImpression?: boolean;
  disableOnViewImpression?: boolean;
}

const Experiment: FC<ExperimentProps> = ({
  children,
  loadingFallback: LoadingComponent,
  variantOverride,
  experimentName,
  disableOnMountImpression,
  disableOnViewImpression,
}) => {

  const {
    isLoading,
    emitExperimentEvent,
    variant,
  } = useExperiment(experimentName, variantOverride);

  const childToRender = useMemo(() => {
    let fallback = null;
    let matchingVariant = null;
    Children.toArray(children).forEach((child) => {
      if (isValidElement(child)) {
        const type = child.type as ReactElement & { isBeakerVariant: boolean };
        if (!type.isBeakerVariant) {
          console.warn('Beaker experiments expect all top level children to be Variant components. In future versions this will be an error.');
        }

        const { variant: childVariant, isDefault } = child.props as VariantProps;

        if (variant && childVariant === variant) {
          matchingVariant = cloneElement(child, {
            disableOnViewImpression,
            disableOnMountImpression,
            emitExperimentEvent,
          } as any)
        }

        if (isDefault) {
          if (fallback) {
            console.warn('Beaker experiments expect only one Variant to be the default variant. In future versions this will be an error.');
          }
          fallback = child;
        }
      }
    });

    return matchingVariant || fallback;
  }, [variant, emitExperimentEvent, disableOnViewImpression, disableOnMountImpression, children]);

  if (isLoading) {
    return LoadingComponent ? <LoadingComponent /> : null;
  }

  return childToRender;
};

export default Experiment;
