import { useContext } from 'react';
import { ExperimentContext } from '../components/ExperimentContext';

const useExperimentContext = () => {
  const context = useContext(ExperimentContext);
  return context;
};

export default useExperimentContext;
