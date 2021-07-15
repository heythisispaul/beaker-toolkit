import { CSSProperties, FC, ReactNode, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export interface VariantProps {
  variant: string;
  isDefault?: boolean;
  viewThreshold?: number;
  style?: CSSProperties;
}

export interface MergedVariantProps extends VariantProps {
  children: ReactNode;
  disableOnViewImpression: boolean;
  disableOnMountImpression: boolean;
  emitExperimentEvent: (type: string) => void;
}

export const Variant: FC<VariantProps> = ({
  children,
  disableOnMountImpression,
  disableOnViewImpression,
  emitExperimentEvent,
  viewThreshold = 0,
  style,
}: MergedVariantProps) => {
  const hasFiredViewImpression = useRef(false);

  useEffect(() => {
    if (!disableOnMountImpression) {
      emitExperimentEvent('IMPRESSED');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { ref, inView } = useInView({ threshold: viewThreshold });

  useEffect(() => {
    if (inView && !hasFiredViewImpression.current && !disableOnViewImpression) {
      emitExperimentEvent('VIEWED');
      hasFiredViewImpression.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  
  return (
    <div ref={ref} style={style || {}}>
      {children}
    </div>
  );
};

export default Object.assign(Variant, { isBeakerVariant: true });
