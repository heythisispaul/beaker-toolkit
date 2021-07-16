import { NextApiRequest } from 'next';
import { v5 as uuid } from 'uuid';

export const X_FORWAREDED_FOR = 'X-Forwarded-For';
export const BEAKER_UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export const generateClientIdFactory = (doNotUseXForwardFor?: boolean) => ({ headers }: NextApiRequest, beakerId: string) => {
  const xForwardFor = headers[X_FORWAREDED_FOR] as string;
  const seed = (doNotUseXForwardFor || !xForwardFor) ? beakerId : xForwardFor;
  return uuid(seed, BEAKER_UUID_NAMESPACE) as string;
};
