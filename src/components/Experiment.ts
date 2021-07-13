import { useEffect, FC, ReactNode } from "react";

export interface BeakerExperimentProps {
  experimentName: string;
  variant?: string;
  fallback?: (props: any) => ReactNode;
}

const Experiment: FC<BeakerExperimentProps> = ({ children }) => {

};

export default Experiment;
